# EG-server

Back End server written with NestJS

## Specifications

- used Mongoose as ODM for MongoDB
- used PassportJS for authentication
- used JWT tokens for authorization
- Implemented Logging and custom logging for critical errors in MongoDB
- Rate limiting to prevent throttling
- used Bcrypt for saving hashed passwords in the database

## /signUp

Authenticates credentials and creates a record in MongoDB and returns a 201 response

## /signIn

Verifies user, signs and returns a JWT token

## /dashboard

Decrypts JWT token, validates user and returns user's name
