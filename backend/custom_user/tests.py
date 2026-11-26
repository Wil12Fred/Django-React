from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase

PASSWORD = 'S3cure-demo-pw'


class RegisterAndJwtTest(APITestCase):
    def register(self, username='demo', email='demo@example.com'):
        return self.client.post('/auth/users/create/', {
            'username': username, 'email': email, 'password': PASSWORD},
            format='json')

    def test_register_creates_a_user_with_a_hashed_password(self):
        response = self.register()
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['username'], 'demo')
        self.assertNotIn('password', response.data)
        user = get_user_model().objects.get(username='demo')
        self.assertNotEqual(user.password, PASSWORD)
        self.assertTrue(user.check_password(PASSWORD))

    def test_register_rejects_a_taken_username(self):
        self.register()
        response = self.register(email='other@example.com')
        self.assertEqual(response.status_code, 400)
        self.assertIn('username', response.data)

    def test_register_rejects_a_common_password(self):
        response = self.client.post('/auth/users/create/', {
            'username': 'demo', 'email': 'demo@example.com',
            'password': 'password'}, format='json')
        self.assertEqual(response.status_code, 400)

    def test_jwt_login_by_username_or_email(self):
        self.register()
        for login in ('demo', 'demo@example.com'):
            with self.subTest(login=login):
                response = self.client.post('/auth/jwt/create/', {
                    'username': login, 'password': PASSWORD}, format='json')
                self.assertEqual(response.status_code, 200)
                self.assertTrue(response.data['token'])

    def test_jwt_rejects_a_wrong_password(self):
        self.register()
        response = self.client.post('/auth/jwt/create/', {
            'username': 'demo', 'password': 'wrong-pw-123'}, format='json')
        self.assertEqual(response.status_code, 400)
        self.assertNotIn('token', response.data)

    def test_jwt_verify_and_refresh(self):
        self.register()
        token = self.client.post('/auth/jwt/create/', {
            'username': 'demo', 'password': PASSWORD}, format='json').data['token']
        self.assertEqual(self.client.post(
            '/auth/jwt/verify/', {'token': token}, format='json').status_code, 200)
        refreshed = self.client.post('/auth/jwt/refresh/', {'token': token}, format='json')
        self.assertEqual(refreshed.status_code, 200)
        self.assertTrue(refreshed.data['token'])
        self.assertEqual(self.client.post(
            '/auth/jwt/verify/', {'token': 'not-a-token'}, format='json').status_code, 400)

    def test_me_requires_a_token(self):
        self.register()
        self.assertEqual(self.client.get('/auth/me/').status_code, 401)
        token = self.client.post('/auth/jwt/create/', {
            'username': 'demo', 'password': PASSWORD}, format='json').data['token']
        self.client.credentials(HTTP_AUTHORIZATION='JWT ' + token)
        response = self.client.get('/auth/me/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['email'], 'demo@example.com')
