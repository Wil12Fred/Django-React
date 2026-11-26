from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

from library.models import Author, Book, Publisher


class CrudTest(APITestCase):
    def setUp(self):
        get_user_model().objects.create_user('demo', 'demo@example.com', 'S3cure-demo-pw')
        token = self.client.post('/auth/jwt/create/', {
            'username': 'demo', 'password': 'S3cure-demo-pw'}, format='json').data['token']
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        self.garcia = Author.objects.create(first_name='Gabriel', last_name='Garcia Marquez')
        self.vargas = Author.objects.create(first_name='Mario', last_name='Vargas Llosa')
        self.cien = Book.objects.create(title='Cien anos de soledad', author=self.garcia,
                                        publication_date='1967-05-30', copies=3)
        self.ciudad = Book.objects.create(title='La ciudad y los perros', author=self.vargas,
                                          publication_date='1963-10-01', copies=1)

    def test_publisher_create_and_list(self):
        response = self.client.post('/api/publisher/', {
            'name': 'Sudamericana', 'address': 'Buenos Aires',
            'website': 'https://example.com'}, format='json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual([p['name'] for p in self.client.get('/api/publisher/').data],
                         ['Sudamericana'])

    def test_publisher_requires_a_valid_website(self):
        response = self.client.post('/api/publisher/', {
            'name': 'X', 'address': 'Y', 'website': 'not a url'}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('website', response.data)
        self.assertEqual(Publisher.objects.count(), 0)

    def test_author_update(self):
        response = self.client.put('/api/author=%d/update/' % self.garcia.id, {
            'first_name': 'Gabo', 'last_name': 'Garcia Marquez'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.garcia.refresh_from_db()
        self.assertEqual(self.garcia.first_name, 'Gabo')

    def test_author_delete_cascades_to_books(self):
        response = self.client.delete('/api/author=%d/delete/' % self.garcia.id)
        self.assertEqual(response.status_code, 204)
        self.assertFalse(Book.objects.filter(pk=self.cien.pk).exists())
        self.assertEqual(self.client.get(
            '/api/author=%d/detail/' % self.garcia.id).status_code, 404)

    def test_book_update_and_delete(self):
        response = self.client.patch('/api/book=%d/update/' % self.cien.id,
                                     {'copies': 5}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['copies'], 5)
        self.assertEqual(self.client.delete(
            '/api/book=%d/delete/' % self.cien.id).status_code, 204)
        self.assertEqual(Book.objects.count(), 1)

    def test_anonymous_cannot_delete(self):
        self.client.credentials()
        self.assertEqual(self.client.delete(
            '/api/book=%d/delete/' % self.cien.id).status_code, 401)
        self.assertTrue(Book.objects.filter(pk=self.cien.pk).exists())

    def test_author_filter_matches_first_or_last_name(self):
        response = self.client.get('/api/authorfilter?filter=vargas')
        self.assertEqual(response.status_code, 200)
        self.assertEqual([a['id'] for a in response.data], [self.vargas.id])
        response = self.client.get('/api/authorfilter?filter=gab')
        self.assertEqual([a['id'] for a in response.data], [self.garcia.id])
        self.assertEqual(len(self.client.get('/api/authorfilter').data), 2)

    def test_author_pages_hold_five(self):
        for i in range(6):
            Author.objects.create(first_name='A%d' % i, last_name='L')
        self.assertEqual(len(self.client.get('/api/authorpage?page=0').data), 5)
        self.assertEqual(len(self.client.get('/api/authorpage?page=1').data), 3)

    def test_book_filter_by_author_and_text(self):
        response = self.client.get('/api/bookfilter?author=%d' % self.vargas.id)
        self.assertEqual([b['title'] for b in response.data], ['La ciudad y los perros'])
        response = self.client.get('/api/bookfilter?filter=Cien')
        self.assertEqual([b['id'] for b in response.data], [self.cien.id])
        response = self.client.get('/api/bookfilter?filter=Garcia')
        self.assertEqual([b['id'] for b in response.data], [self.cien.id])
