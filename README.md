## Challenge
Let us manage, reserve and ultimately sell our product!

## Assumptions
We assume that there is only one size, color and model for given product.

## Libraries/Tools used
* NestJS is a framework for building efficient, scalable Node.js server-side applications.
* Typescript
* Uses TypeORM as ORM (Object-relational mapping)
* Uses Jest for testing
* OpenAPI Swagger

## Setup
Run the following commands to setup, given ```node```, ```npm``` and ```docker``` is installed and functional.

```bash
# Installing needed dependencies
$ npm install
```
```bash
# Spinning up postgres
$ docker run --rm --name challenge-db -p 2345:5432 -e POSTGRES_PASSWORD=mypassword -d postgres
```

## Running the app
After successful starting the app, you can access Swagger here: ```http://localhost:3000/swagger-ui```.

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test
```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## If it was a bigger project

This is a coding challenge and scope is quite small. If it was a bigger real project, doing the following would be better:

* More focus on architecture and software design would be necessary.
* Create database for usage instead of using postgres internal database.
* Move all configs to centralized ConfigService, that provides needed configs and passing all configs in via environment variables.
* It would be great to have some mutation testing in place like [Stryker](https://stryker-mutator.io/) to know how effective the tests are in addition to the coverage.
* Use a test-db for e2e-testing, higher test coverage
* Setup security correctly
* Centralized exception handler
