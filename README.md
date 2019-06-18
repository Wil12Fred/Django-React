## A React + Django Rest Framework: authentication example + Library management

### Functionality:

* [x] Login
* [x] Registration
* [x] Password Change
* [x] Library management: Books, Authors

### How to use:

- Clone the repo
#### Frontend
1. cd frontend && npm install
2. enter your backend url in actions/backendUrl.js or add an environment variable named REACT_APP_DEV_URL 
3. npm start
#### Backend
1. cd backend, pipenv shell, pipenv install
2. python3 manage.py makemigrations custom_user
3. python3 manage.py makemigrations library
4. python3 manage.py migrate
5. python3 manage.py createsuperuser
3. python3 manage.py runserver

### Based on

* https://github.com/opmftw/react-django-login-example
