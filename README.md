# Shop Platform – Full Stack E-Commerce Project

A modern, full-stack e-commerce platform built as a learning and portfolio project.  
This repository contains the **backend RESTful API** (Node.js, TypeScript, PostgreSQL, Prisma), with plans for a React frontend for both users and admins.
To use the website the username is "admin" no spaces or capital, and the password is "password", might take a minute to spin up if it has not been active.

---

## Overview

This project aims to deliver a robust, scalable, and secure shop platform with:

- **Backend:** RESTful API using TypeScript, Node.js, Express, PostgreSQL, Prisma ORM, JWT authentication, and Cloudinary for image/content storage.
- **Frontend:** React application (planned) with separate interfaces for users and admins.

---

## Features

### User Features

- Register and log in securely
- Browse and search products
- Add products to cart
- Place orders

### Admin Features

- Admin dashboard (planned in React)
- CRUD operations on products (add, edit, delete)
- View, fill, and unfill orders
- Access analytics (sales, revenue, user stats, etc.)
- View all products, users, and orders

### Shared Features

- JWT-based authentication and role-based authorization
- Cloudinary integration for product images
- Robust database schema with Prisma and PostgreSQL
- Modular, scalable codebase with clear separation of concerns
- Unit and integration testing with Jest

---

## Tech Stack

- **Backend:** Node.js, Express, TypeScript, PostgreSQL, Prisma ORM, JWT, Cloudinary, OpenAI
- **Frontend:** React (planned)
- **Testing:** Jest, Supertest

---

## Setup

1. Clone the repo
2. Install dependencies: `npm install`
3. Set up the database: `npx prisma migrate dev`
4. Seed the database (optional): `npx ts-node prisma/seed.ts`
5. Start the server: `npx ts-node server.ts`

---



## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
devDATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_APIKEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
OPENAI_API_KEY=your_openai_api_key
```

- Replace the values with your actual credentials.
- `devDATABASE_URL` is your PostgreSQL connection string.
- `JWT_SECRET` is any random string for JWT signing.
- Cloudinary variables are for image upload support.
- `OPENAI_API_KEY` is for OpenAI integration.

---

## Documentation



---

## Cart API Routes

| Method | Endpoint                        | Description                                 | Auth Required | Body/Params                       |
|--------|---------------------------------|---------------------------------------------|--------------|-----------------------------------|
| GET    | `/cart/`                        | Retrieve the current user's cart            | Yes          | -                                 |
| DELETE | `/cart/remove/:id`              | Remove an item from the cart by item ID     | Yes          | URL param: `id`                   |
| POST   | `/cart/add`                     | Add an item to the cart                     | Yes          | `{ productId, quantity }`         |
| PATCH  | `/cart/item/increase/:productId`| Increase quantity of a cart item            | Yes          | URL param: `productId`            |
| PATCH  | `/cart/item/decrease/:productId`| Decrease quantity of a cart item            | Yes          | URL param: `productId`            |
| GET    | `/cart/subtotal`                | Get the subtotal of the current cart        | Yes          | -                                 |
| POST   | `/cart/placeorder`              | Place an order with the current cart        | Yes          | (Cart must have items)            |

**Notes:**
- All routes require JWT authentication.
- Validation is applied to all modifying routes.
- `add`, `increase`, and `decrease` expect appropriate validation for product and quantity.

---

## Order API Routes

| Method | Endpoint                                 | Description                                  | Auth Required | Body/Params                       |
|--------|------------------------------------------|----------------------------------------------|--------------|-----------------------------------|
| GET    | `/order/user`                            | Get all orders for the current user          | Yes          | -                                 |
| GET    | `/order/all`                             | Get all orders (admin only)                  | Admin        | -                                 |
| GET    | `/order/filled`                          | Get all filled orders (admin only)           | Admin        | -                                 |
| GET    | `/order/unfilled`                        | Get all unfilled orders (admin only)         | Admin        | -                                 |
| POST   | `/order/markFilledOrUnfilled/:id`        | Toggle filled/unfilled status for an order   | Admin        | URL param: `id`                   |
| PATCH  | `/order/mark/:id`                        | Toggle filled/unfilled status for an order   | Admin        | URL param: `id`                   |
| GET    | `/order/:id`                             | Get a specific order by ID                   | Yes          | URL param: `id`                   |

**Notes:**
- All routes require JWT authentication.
- Admin-only routes require the user to have admin privileges.
- Marking/toggling endpoints change the filled status of an order.

---

## Product API Routes

| Method | Endpoint                          | Description                                 | Auth Required | Body/Params                       |
|--------|-----------------------------------|---------------------------------------------|--------------|-----------------------------------|
| GET    | `/product/all`                    | Get all products                            | No           | -                                 |
| GET    | `/product/:id`                    | Get a product by ID                         | No           | URL param: `id`                   |
| POST   | `/product/create`                 | Create a new product                        | Admin        | Product fields + image file       |
| PATCH  | `/product/update/:id`             | Update a product by ID                      | Admin        | URL param: `id`, product fields   |
| DELETE | `/product/delete/:id`             | Delete a product by ID                      | Admin        | URL param: `id`                   |
| POST   | `/product/filter`                 | Filter products by category or other fields | No           | `{ filter, value }`               |
| POST   | `/product/search`                 | Search products by name or keyword          | No           | `{ search }`                      |
| GET    | `/product/top`                    | Get top selling products                    | No           | Query param: `limit` (optional)   |

**Notes:**
- Admin routes require JWT authentication and admin privileges.
- Product creation and update support image upload via Cloudinary.
- Filtering and search endpoints accept JSON bodies for flexible queries.

---

## User API Routes

| Method | Endpoint              | Description                              | Auth Required | Body/Params                         |
|--------|----------------------|------------------------------------------|--------------|-------------------------------------|
| POST   | `/user/login`        | Log in and receive a JWT                 | No           | `{ username, password }`            |
| POST   | `/user/create`       | Register a new user                      | No           | `{ name, username, password }`      |
| GET    | `/user/info`         | Get info for the authenticated user      | Yes          | -                                   |
| POST   | `/user/info/upsert`  | Add or update user info                  | Yes          | User info fields                    |
| GET    | `/user/info/exists`  | Check if user info exists                | Yes          | -                                   |
| GET    | `/user/all`          | Get all users (admin only)               | Admin        | -                                   |
| GET    | `/user/:id`          | Get a user by ID (admin only)            | Admin        | URL param: `id`                     |

**Notes:**
- JWT authentication required for all routes except login and create.
- Admin-only routes require the user to have admin privileges.
- User info endpoints allow users to manage their profile details.

---

## Pagination

The following endpoints support **optional pagination** using the `?page` and `?limit` query parameters:

- `/product/all`
- `/order/all`
- `/order/filled`
- `/order/unfilled`
- `/user/all`

**Usage Example:**
```
/product/all?page=2&limit=10
```
This returns page 2 with 10 items per page.

If `page` and `limit` are omitted, all results are returned.

---

## Next Steps

- Complete the AI analytics tooling (add more tools/endpoints for analytics and reporting)
- Complete the React frontend
- Enhance testing coverage and CI/CD integration
- Deploy to a cloud provider (e.g., Heroku, AWS, etc.)


