# Monter Auth API

This project implements a set of APIs for user registration, varifying User with OTP, login, and profile management using Express.js and MongoDB

## Prerequisites

- Node
- Express
- Mongodb (mongoose)
- JSON Web Tokens (JWT)
- Bcrypt for hashing passwords
- Nodemailer for sending emails

## Installing

**1. Clone the repository**

- run `git clone "url"`

**2. Install dependencies**

- run `npm install`

**3. Run the server**

- run `npm run dev`

## API Endpoints

- POST /register - Registers a new user.

- POST /verify - Verifies user email via OTP.

- POST /login - Authenticates a user and returns a JWT.

- PUT /update-profile - Updates authenticated user's profile information.

- GET /user-info - Retrieves the authenticated user's profile information.

## Environment Variables

DB_URL

PORT

EMAIL_USER

EMAIL_PASS

JWT_SECRET
