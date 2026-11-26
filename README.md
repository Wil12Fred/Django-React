# django-react-library

> library management with JWT auth

A React + Redux single-page app on top of a Django REST Framework API. Users
register, log in with JWT and manage a small library (authors, books,
publishers). Started from
[opmftw/react-django-login-example](https://github.com/opmftw/react-django-login-example)
and extended during a 2019 hackathon/course project.

- **backend/** — Django 2.2, DRF, [djoser](https://djoser.readthedocs.io/) 1.x
  for registration / password change, `djangorestframework-jwt` for tokens,
  Swagger UI at `/`. Apps: `custom_user` (login by username *or* e-mail),
  `library` (CRUD, paging and filter endpoints), `pago` (payment models,
  not wired into the URLs).
- **frontend/** — Create React App 1.x, Redux + redux-thunk, Material-UI,
  reactstrap. Routes `/login`, `/register`, `/changepassword`, `/author`,
  `/book`, `/publisher`, `/author/register`, `/book/register`.

## Backend

Requires [uv](https://docs.astral.sh/uv/) and Python 3.10–3.12.

```bash
cd backend
uv sync
uv run python manage.py migrate         # creates backend/db.sqlite3
uv run python manage.py createsuperuser
uv run python manage.py runserver       # http://127.0.0.1:8000
uv run python manage.py test
```

A `db.sqlite3` left over from the 2019 version (it used to be committed)
has an incompatible migration history: delete it and migrate again.

Example session (real output):

```
$ curl -X POST -H 'Content-Type: application/json' \
    -d '{"username":"demo","email":"demo@example.com","password":"S3cure-demo-pw"}' \
    http://127.0.0.1:8000/auth/users/create/
{"email":"demo@example.com","username":"demo","id":1}
$ curl -X POST ... /auth/jwt/create/            -> {"token": "..."}
$ curl -H "Authorization: JWT <token>" -H 'Content-Type: application/json' \
    -d '{"first_name":"Gabriel","last_name":"Garcia Marquez"}' http://127.0.0.1:8000/api/author/
{"id":1,"first_name":"Gabriel","last_name":"Garcia Marquez","email":null}
```

Why Django 2.2: djoser 1.x — whose URLs (`/auth/users/create/`,
`/auth/password/`, `/auth/jwt/create/`) the frontend calls — does not run on
Django 3+. `config/py312_compat.py` lets Django 2.2's bundled `six` work on
Python 3.12. `DJANGO_SECRET_KEY` overrides the development key. The settings
module is chosen in `config/environment.py` (`development` by default;
`production` expects PostgreSQL: `uv sync --extra postgres`).

## Frontend

Requires Node.js (tested with Node 24, npm 11).

```bash
cd frontend
npm ci
npm start              # dev server on http://localhost:3000
npm run build          # production bundle in frontend/build/
```

The API URL defaults to `http://127.0.0.1:8000` (`src/actions/backendUrl.js`);
override it with `REACT_APP_DEV_URL`.

## Layout

```
backend/
  config/          settings (base/local/development/production), urls
  custom_user/     custom User model + migration
  library/         models, serializers, views, urls, API tests
  pago/            payment models (unused by the API)
frontend/
  src/actions, reducers, store.js    Redux auth + password flows
  src/components, containers         pages and forms
```
