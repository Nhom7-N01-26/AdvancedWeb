# NestJS API test requests

Base URL: `http://localhost:3001/api`

All write endpoints use JSON and are validated by NestJS `ValidationPipe`.

## Read endpoints

```http
GET /users
GET /users/:id
GET /authors
GET /authors/:id
GET /categories
GET /categories/:id
GET /tags
GET /tags/:id
GET /novels
GET /novels/:id
GET /chapters
GET /chapters?novelId=1
GET /chapters/:id
```

## Create examples

```http
POST /users
Content-Type: application/json

{
  "username": "reader_new",
  "email": "reader_new@example.com",
  "passwordHash": "bcrypt-hash-value",
  "fullName": "New Reader"
}
```

```http
POST /novels
Content-Type: application/json

{
  "authorId": 1,
  "title": "A New Novel",
  "slug": "a-new-novel",
  "status": "draft",
  "categoryIds": [1],
  "tagIds": [1]
}
```

```http
POST /chapters
Content-Type: application/json

{
  "novelId": 1,
  "chapterNumber": 1,
  "title": "Chapter One",
  "content": "Chapter content",
  "status": "draft"
}
```

## Update and delete examples

```http
PUT /novels/1
Content-Type: application/json

{
  "title": "Updated Novel Title"
}
```

```http
DELETE /novels/1
```

The same `POST`, `PUT`, and `DELETE` pattern applies to `users`, `authors`, `categories`, `tags`, and `chapters`.

## Expected errors

- Invalid body or ID: `400 Bad Request`
- Missing entity: `404 Not Found`
- Duplicate username, slug, or unique relation: `409 Conflict`
- Database connectivity failure: `500 Internal Server Error`
