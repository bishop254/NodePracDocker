# NodePracDocker

# DockerHub URL
https://hub.docker.com/repository/docker/beeshop254/node_backend

## To run the API
> npm start

This will run nodemon server.js

## To run tests with mocha
> npm test

### Main Routes
* /users
* /product
* /orders

### Protected routes
Utilizes jwt to create an authentication token.
A middleware is added for protected routes and requires a user to pass a token in the request header.
