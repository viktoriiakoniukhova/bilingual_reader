# Bilingual Book Reader

### Links:

- [Product overview Google Doc](https://docs.google.com/document/d/1ZmskmSaDiXLXqk0TzncakeYAH2BZ8ukKBrof6XO_mxE/edit)
- [Jira Board](https://balitik365247.atlassian.net/jira/software/projects/BR/boards/1)

## How to run

```bash
$ docker-compose up -d
```

## How to run front part

### Installs dependencies

```bash
npm install
cd frontend
```

#### Run

```bash
npm run dev
```

and it should be up and running on [http://localhost:8000](http://localhost:8000)

## Dev Setup for Backend

1. Create venv and activate it

```bash
$ python3 -m venv ./.venv/
$ source .venv/bin/activate
```

2. Install dependencies

```bash
(.venv) $ python3 -m pip install -r requirements.txt
```

3. run mongodb

```bash
(.venv) $ docker-compose up mongodb
```

5. configure db

```bash
(.venv) $ python3 manage.py migrate
(.venv) $ python3 manage.py createsuperuser  # root root will suffice for dev
```

6. cd to `/book_app` and run dev server

```bash
(.venv) $ python3 manage.py runserver localhost:8000
```

## Examples

Using [HTTPie cli](https://httpie.io/) for all requests. Files used are in the root of the repository. More examples are in [/views.py](./backend/book_app/views.py) methods docstrings.

### Add book

```bash
> http --form POST localhost:8000/book/create/ Authorization:'Token 1f4d11463fdf813edc9353cdb24f73af7b0cfb7e' english@./treasure-island.epub book='{"title": "Harry Potter", "origin_language": "en", "translations_count": 1, "translation_0_language": "ua", "translator_0": ["pagarsky"], "author": ["pagarsky"], "genre": ["genre"], "ageRestriction": "12+", "totalPages": 451}' translation_0@./ukrainian.epub preview@./silly_cat.jpeg

HTTP/1.1 201 Created
Allow: OPTIONS, POST
Content-Length: 74
Content-Type: application/json
Cross-Origin-Opener-Policy: same-origin
Date: Sun, 05 May 2024 10:29:30 GMT
Referrer-Policy: same-origin
Server: WSGIServer/0.2 CPython/3.11.9
Vary: Accept
X-Content-Type-Options: nosniff
X-Frame-Options: DENY

{
    "bookId": "66375f8a5227c764e21c5dca",
    "message": "Book added successfully."
}
```

### Create user

```bash
$ http POST localhost:8000/user/create/ username='root_3' password='root8888' email=your_mail@gmail.com phone=+380960001111

HTTP/1.1 201 Created
Allow: OPTIONS, POST
Content-Length: 204
Content-Type: application/json
Cross-Origin-Opener-Policy: same-origin
Date: Sun, 05 May 2024 10:33:22 GMT
Referrer-Policy: same-origin
Server: WSGIServer/0.2 CPython/3.11.9
Vary: Accept, Cookie
X-Content-Type-Options: nosniff
X-Frame-Options: DENY

{
    "token": "cbbf498aebc00bd9c5cec3032b2d883fd5a5e6a9",
    "user": {
        "avatar": null,
        "books": null,
        "email": "your_mail@gmail.com",
        "first_name": "",
        "id": 6,
        "last_name": "",
        "phone": "+380960001111",
        "username": "root_3"
    }
}
```
