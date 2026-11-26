from rest_framework.test import APITestCase


class LibraryApiTest(APITestCase):
    """Register through djoser, log in with JWT, then use the library API."""

    def setUp(self):
        response = self.client.post('/auth/users/create/', {
            'username': 'demo', 'email': 'demo@example.com',
            'password': 'S3cure-demo-pw'}, format='json')
        self.assertEqual(response.status_code, 201)
        response = self.client.post('/auth/jwt/create/', {
            'username': 'demo', 'password': 'S3cure-demo-pw'}, format='json')
        self.assertEqual(response.status_code, 200)
        self.token = response.data['token']

    def test_anonymous_can_read_but_not_write(self):
        self.assertEqual(self.client.get('/api/author/').status_code, 200)
        response = self.client.post('/api/author/', {'first_name': 'X'})
        self.assertEqual(response.status_code, 401)

    def test_create_author_and_book(self):
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        author = self.client.post('/api/author/', {
            'first_name': 'Gabriel', 'last_name': 'Garcia Marquez'},
            format='json')
        self.assertEqual(author.status_code, 201)
        book = self.client.post('/api/book/', {
            'title': 'Cien anos de soledad', 'author': author.data['id'],
            'publication_date': '1967-05-30', 'copies': 3}, format='json')
        self.assertEqual(book.status_code, 201)

        response = self.client.get('/api/bookfilter?year=1967')
        self.assertEqual([b['title'] for b in response.data],
                         ['Cien anos de soledad'])
        response = self.client.get(
            '/api/book=%d/detail/' % book.data['id'])
        self.assertEqual(response.data['copies'], 3)

    def test_change_password(self):
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + self.token)
        response = self.client.post('/auth/password/', {
            'current_password': 'S3cure-demo-pw',
            'new_password': 'An0ther-demo-pw',
            're_new_password': 'An0ther-demo-pw'}, format='json')
        self.assertEqual(response.status_code, 204)
