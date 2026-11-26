# django-react-library

[![CI](https://github.com/Wil12Fred/django-react-library/actions/workflows/ci.yml/badge.svg)](https://github.com/Wil12Fred/django-react-library/actions/workflows/ci.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Library management (authors, books, publishers) as a React + Redux single-page
app on top of a Django REST Framework API with JWT authentication — users
register, log in by username or e-mail and manage the catalogue.

## Features

- **Backend** (`backend/`): Django 2.2, DRF, [djoser](https://djoser.readthedocs.io/)
  1.x for registration and password change, `djangorestframework-jwt` for
  tokens (create / verify / refresh, one-hour expiry), Swagger UI at `/`.
  - `custom_user`: a custom `User` that logs in with its username **or** e-mail.
  - `library`: CRUD for publishers, authors and books, pages of five
    (`/api/authorpage?page=N`, `/api/bookpage?page=N`), an author search by
    first or last name and a book filter by author, year and text.
  - Anonymous users can read; writing needs a JWT (`Authorization: JWT <token>`).
- **Frontend** (`frontend/`): Create React App 1.x, Redux + redux-thunk,
  Material-UI, reactstrap. Routes `/login`, `/register`, `/changepassword`,
  `/author`, `/book`, `/publisher`, `/author/register`, `/book/register`; a
  middleware refreshes the JWT when it has less than 30 minutes left.

## Requirements

- Python 3.10–3.12 and [uv](https://docs.astral.sh/uv/).
  - Debian/Ubuntu: `sudo apt install python3`, then
    `curl -LsSf https://astral.sh/uv/install.sh | sh` (uv is not packaged).
  - Arch: `sudo pacman -S python uv`
- Node.js and npm (tested with Node 24, npm 11).
  - Debian/Ubuntu: `sudo apt install nodejs npm`
  - Arch: `sudo pacman -S nodejs npm`
- Optional: PostgreSQL for the `production` settings (`postgresql` on both).

Configuration is read from the environment; see `.env.example`
(`DJANGO_SECRET_KEY` and the frontend's `REACT_APP_DEV_URL`). The settings
module is chosen in `backend/config/environment.py` (`development` by
default; `production` expects PostgreSQL: `uv sync --extra postgres`).

## Build

```bash
cd backend && uv sync --locked && uv run python manage.py check
cd frontend && npm ci && npm run lint && npm run build   # bundle in frontend/build/
```

## Run

```bash
cd backend
uv run python manage.py migrate         # creates backend/db.sqlite3
uv run python manage.py runserver       # http://127.0.0.1:8000

cd frontend
npm start                               # http://localhost:3000
```

The frontend calls `http://127.0.0.1:8000` (`src/actions/backendUrl.js`)
unless `REACT_APP_DEV_URL` is set.

Captured from a real run against a fresh database:

```
$ curl -X POST -H 'Content-Type: application/json' \
    -d '{"username":"demo","email":"demo@example.com","password":"S3cure-demo-pw"}' \
    http://127.0.0.1:8000/auth/users/create/
{"email":"demo@example.com","username":"demo","id":1}
$ curl -X POST -H 'Content-Type: application/json' \
    -d '{"username":"demo@example.com","password":"S3cure-demo-pw"}' \
    http://127.0.0.1:8000/auth/jwt/create/
{"token":"eyJ0eXAiOiJKV1Qi..."}
$ curl -H "Authorization: JWT <token>" -H 'Content-Type: application/json' \
    -d '{"first_name":"Gabriel","last_name":"Garcia Marquez"}' http://127.0.0.1:8000/api/author/
{"id":1,"first_name":"Gabriel","last_name":"Garcia Marquez","email":null}
$ curl 'http://127.0.0.1:8000/api/authorfilter?filter=garcia'
[{"id":1,"first_name":"Gabriel","last_name":"Garcia Marquez","email":null}]
```

## Tests

```bash
cd backend && uv run python manage.py test        # 19 tests, SQLite
cd frontend && npm test                           # 15 tests, Jest + jsdom
```

- `backend/custom_user/tests.py` — registration (password stored hashed,
  duplicate username and common password rejected), JWT login by username
  and by e-mail, wrong password refused, token verify/refresh, `/auth/me/`
  needs a token.
- `backend/library/tests.py`, `test_api.py` — anonymous read vs. authenticated
  write, create/update/delete for authors, books and publishers (URL
  validation, cascade from author to books), anonymous delete refused, the
  author search, five-per-page paging, the book filter by author, year and
  text, password change.
- `frontend/src/__tests__/` — the auth and change-password reducers, the
  combined store shape, and the actions: token stored on login and removed
  on logout, redirect away from `/login`, the JWT and djoser endpoints called
  with the right body, and the change-password thunk dispatching
  request → success / failure with the stored token.

CI also runs `manage.py check`, `makemigrations --check`, ESLint with the
Create React App rules and no warnings allowed, and the production build.

## Project layout

```
backend/
  config/          settings (base/local/development/production), urls,
                   py312_compat.py (six shim for Django 2.2 on Python 3.12)
  custom_user/     User model with e-mail login, tests
  library/         models, serializers, views, urls, API tests
frontend/
  src/actions, reducers, store.js    Redux auth and password flows
  src/components, containers         pages and forms
  src/customMiddleware               JWT refresh
  src/__tests__                      Jest tests
```

## Known limitations

- **Pinned old stack.** djoser 1.x — whose URLs (`/auth/users/create/`,
  `/auth/password/`, `/auth/jwt/create/`) the frontend calls — does not run on
  Django 3+, so the backend stays on Django 2.2 (end of life) with
  `djangorestframework-jwt` (unmaintained) and needs the `six` shim in
  `config/py312_compat.py` and `setuptools<81` for `distutils` on Python 3.12.
  Moving to Django 4 means djoser 2 and `djangorestframework-simplejwt`, with
  new URLs on both sides; that migration was not attempted.
- The frontend is Create React App 1.1 (webpack 3, Jest 20) and has npm audit
  findings that cannot be fixed without that upgrade.
- The 2019 `pago` (payments) app was **removed**: it was never routed, and
  its models stored card numbers and CVV codes, which must never be stored.
  A database migrated with the old code still has its `pago_*` tables.
- A `db.sqlite3` left over from the 2019 version (it used to be committed)
  has an incompatible migration history: delete it and migrate again.
- The page endpoints answer 500 without `?page=`, and the book text filter
  fails for an author with an empty first or last name.
- Forms in the frontend post with `fetch` and only log the response; errors
  are not shown to the user.

## Background

Built in 2019 for a hackathon and university course project, starting from
the `opmftw/react-django-login-example` login template and extending it with
the library API and pages.

## License

MIT — see [LICENSE](LICENSE).
