# Shop Platform – Full Stack E-Commerce Project

A modern, full-stack e-commerce platform built as a learning and portfolio project.  
This repository contains the **backend RESTful API** (Node.js, TypeScript, PostgreSQL, Prisma), with plans for a React frontend for both users and admins.

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

## Next Steps

- Complete the AI analytics tooling (add more tools/endpoints for analytics and reporting)
- Complete the React frontend
- Enhance testing coverage and CI/CD integration
- Deploy to a cloud provider (e.g., Heroku, AWS, etc.)


