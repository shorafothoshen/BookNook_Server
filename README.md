# BookNook Server

An Express and TypeScript REST API for BookNook. It stores books and borrowing records in MongoDB and uses JWTs to authenticate users on protected endpoints.

## Features

- Add, view, update, and delete books
- View books added by the authenticated user
- Borrow and return books, and view personal borrowing records
- Browse new, featured, and most-borrowed books
- Authenticate users on protected endpoints with JWTs

## Tech Stack

- Node.js, TypeScript, Express
- MongoDB Atlas
- `jose` (JWT verification)

## Setup

1. Clone the repository and navigate to the project directory.
2. Install the dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the project root and set the required variables:

   ```env
   MONGODB_USER=your_mongodb_username
   MONGODB_USER_PASS=your_mongodb_password
   CLIENT_URL=https://your-client-domain.com
   PORT=5000
   ```

   `PORT` is optional; the server defaults to port `5000`. Set `CLIENT_URL` to the client application's origin. The server uses its `/api/auth/jwks` endpoint to verify tokens. The supplied MongoDB Atlas credentials must have access to the cluster.

4. Start the development server:

   ```bash
   npm run dev
   ```

   The server runs at `http://localhost:5000` (or the configured `PORT`). To start it without watch mode, use `npm start`.

## API

All endpoints use the `/api` base path. Send this header when calling a protected endpoint:

```http
Authorization: Bearer <JWT>
```

| Method | Endpoint | Auth | Description |
| --- | --- | :---: | --- |
| `GET` | `/api/books` | Yes | List all books |
| `GET` | `/api/books/:id` | Yes | Get a book by ID |
| `GET` | `/api/limit-books` | No | Get the six most recently added books |
| `POST` | `/api/add-books` | Yes | Add a book |
| `GET` | `/api/my-books` | Yes | List books added by the authenticated user |
| `PATCH` | `/api/update-book/:id` | Yes | Update a book |
| `DELETE` | `/api/delete-book/:id` | Yes | Delete a book |
| `GET` | `/api/trending-books` | No | Get featured, new, and most-borrowed books |
| `GET` | `/api/my-borrows` | Yes | List the authenticated user's active borrow records |
| `POST` | `/api/borrow/:id` | Yes | Borrow a book |
| `PATCH` | `/api/return/:id` | Yes | Return a borrowed book |

Replace `:id` with the corresponding MongoDB ObjectId. The API may return `400` for an invalid ID and `404` when a resource is not found.

### Book request body

Send book details as a JSON body to `POST /api/add-books`:

```json
{
  "title": "The Hobbit",
  "author": "J. R. R. Tolkien",
  "category": "Fiction",
  "image": "https://example.com/book-cover.jpg",
  "description": "A fantasy adventure.",
  "totalCopies": 5,
  "availableCopies": 5
}
```

Supported `category` values are `Fiction`, `Science`, `History`, `Kids`, and `Others`. The server sets `userName`, `userEmail`, and `createdAt` from the authenticated user and current time.

### Borrow request body

Send a `returnDate` to `POST /api/borrow/:id`:

```json
{
  "returnDate": "2026-12-10T00:00:00.000Z"
}
```

A successful borrow decreases the book's available copy count and increments its borrow count. The return endpoint takes the borrow record ID; a successful return increases the book's available copy count.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server in watch mode |
| `npm start` | Start the server |
| `npm test` | No test suite is currently configured |

## Project Structure

```text
src/
├── config/       # MongoDB connection
├── middleware/   # JWT verification
├── models/       # Books and borrows collections
├── routes/       # API routes
└── index.ts      # Express app and server entry point
```
