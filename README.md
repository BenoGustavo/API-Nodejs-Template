# ToDo List API

A comprehensive ToDo List API built with Node.js, Express, and MongoDB. This project includes user authentication, list and todo management, and detailed error handling.

## Features

- ✅ Express.js for server-side logic

- ✅ Mongoose for MongoDB interactions

- ✅ JWT for authentication

- ✅ Swagger for API documentation

- ✅ Jest for testing

- ✅ ESLint with Airbnb style guide

- ✅ Environment variable management with dotenv

- ✅ Error handling with custom error classes

## Getting Started

### Pre-requisites

- Node.js >= 22.0.0
- npm or yarn

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/yourusername/todo-list-api.git
   cd todo-list-api
   ```

2. Install dependencies:

   ```sh
   yarn install
   ```

3. Create a .env file based on .env.example:

   ```sh
   cp .env.example .env
   ```

4. Update the .env file with your configuration.

### Running the Application

#### Development

To run the application in development mode with hot-reloading:

```sh
yarn run dev
```

#### Production

To build and run the application in production mode:

```sh
yarn run build
yarn start
```

### Debugging

To run the application in debug mode:

```sh
yarn run debug
```

### Linting

To lint the codebase:

```sh
yarn run lint
```

### Testing

To run tests:

```sh
yarn test
```

## Project Structure

```
.babelrc
.editorconfig
.env
.env.example
.eslintrc.js
.gitignore
eslint.config.mjs
jest.config.js
launch.json
LICENSE
nodemon.json
package.json
README.md
src/
  app.js
  controllers/
    ListController.js
    ToDoController.js
    UserController.js
  database/
    Connection.js
    models/
      ListSchema.js
      TodoSchema.js
      UserSchema.js
  dto/
    ListDto.js
    response/
      ResponseDto.js
    TodoDto.js
    user/
      UserLoginDto.js
      UserRegisterDto.js
      UserResetPasswordDto.js
  errors/
    database/
      AdaptMongooseError.js
      DatabaseErrors.js
    http/
      BadRequest.js
      Forbidden.js
      NotFound.js
      ServerError.js
      Unauthorized.js
    InvalidIdError.js
  middlewares/
    AuthMiddleware.js
    GlobalErrorHandler.js
    SwaggerMiddleware.js
  routes/
    index.js
    list/
      ListRouter.js
    todos/
      ToDoRouter.js
    user/
      UserRouter.js
    ping/
      helloWorld.js
  server.js
  services/
    JwtService.js
    ListService.js
    ToDoService.js
    UserService.js
tests/
  List.test.js
  ToDo.test.js
  User.test.js
swagger.yaml
```

## Architecture and Code Structure

The project follows a modular architecture, separating concerns into different layers and directories:

- **Controllers**: Handle incoming HTTP requests and delegate actions to the appropriate services. Example: `ToDoController`.

- **Services**: Contain the business logic and interact with the database models. Example: `ToDoService`.

- **Models**: Define the Mongoose schemas and models for MongoDB collections. Example: `TodoSchema`.

- **DTOs (Data Transfer Objects)**: Define the structure of data being transferred between layers. Example: `TodoDto`.

- **Middlewares**: Contain reusable middleware functions for request processing. Example: `AuthMiddleware`.

- **Routes**: Define the API endpoints and map them to controller actions. Example: `ToDoRouter`.

- **Errors**: Custom error classes for handling different types of errors. Example: `NotFound`.

- **Tests**: Unit tests for the application using Jest. Example: `ToDo.test.js`.

## Topics Covered

1. **Project Setup**

   - ✅ Initializing a Node.js project with `npm` and `yarn`

   - ✅ Installing necessary dependencies (e.g., Express, Mongoose)

2. **Service Layer Implementation**

   - ✅ Creating the `ListService` class

   - ✅ Implementing CRUD operations (Create, Read, Update, Delete) for lists

   - ✅ Handling Mongoose database errors

3. **Router Configuration**

   - ✅ Setting up Express routers

   - ✅ Defining routes for list operations (`createList`, `getLists`, `getListById`, `updateList`, `deleteList`)

   - ✅ Applying authentication middleware to routes

4. **Error Handling**

   - ✅ Creating custom error classes (e.g., `InvalidIdError`, `NotFound`, `ServerError`)

   - ✅ Implementing a global error handler for the application

   - ✅ Handling specific Mongoose errors (e.g., duplicate key errors)

5. **Swagger Documentation**

   - ✅ Writing Swagger YAML documentation for API endpoints

   - ✅ Defining schemas for request and response bodies

   - ✅ Setting up security schemes for authentication

6. **Testing Setup**

   - ✅ Installing Jest for testing

   - ✅ Creating a basic test configuration

   - ✅ Writing initial test cases for the application

## License

This project is licensed under the MIT License - see the

LICENSE

file for details.
