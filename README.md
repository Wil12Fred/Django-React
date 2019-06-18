## A React + Redux / Django Rest Framework authentication example

### Functionality:

* [x] Login with JWT
* [x] middleware for JWT refresh if expiring
* [x] Registration
* [x] Dynamic navbar switching when user logs in / logs out
* [x] Password Change
* [x] Screen size responsive components & Navbar
* [x] Library management: Books, Authors


### How to use:

- Clone the repo
#### Frontend
1. cd frontend && npm install
2. enter your backend url in actions/backendUrl.js or add an environment variable named REACT_APP_DEV_URL 
3. npm start
#### Backend
1. cd backend, pipenv shell, pipenv install
2. python manage.py makemigrations custom_user
3. python manage.py makemigrations library
4. python manage.py migrate
5. python manage.py createsuperuser
3. python manage.py runserver

