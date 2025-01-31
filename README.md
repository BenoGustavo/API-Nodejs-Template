Collecting workspace information

Here is a README file for your template application:

````markdown
# Backend Template

A simple Node.js back-end template with all configuration and folder structure already set up.

## Features

- Express.js for server-side logic
- Sucrase for ES6+ support
- Nodemon for development
- ESLint with Airbnb style guide
- Environment variable management with dotenv
- CORS support
- Error handling with Youch

## Getting Started

### Pre-requisites

- Node.js >= 22.0.0
- npm

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/backend-template.git
   cd backend-template
   ```
````

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a

.env

file based on

.env.example

:

```sh
cp .env.example .env
```

4. Update the

.env

file with your configuration.

### Running the Application

#### Development

To run the application in development mode with hot-reloading:

```sh
npm run dev
```

#### Production

To build and run the application in production mode:

```sh
npm run build
npm start
```

### Debugging

To run the application in debug mode:

```sh
npm run debug
```

### Linting

To lint the codebase:

```sh
npm run lint
```

## Project Structure

```
.editorconfig
.env
.env.example
.eslintrc.js
.gitignore
eslint.config.mjs
launch.json
LICENSE
nodemon.json
package.json
README.md
src/
  app.js
  dto/
    response/
      ResponseDto.js
  routes/
    index.js
  server.js
```

## app.js

Main application setup and middleware configuration.

## server.js

Entry point to start the server.

## index.js

Route definitions.

## ResponseDto.js

Data Transfer Object for responses.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

```

Feel free to customize this README file further based on your specific needs.
Feel free to customize this README file further based on your specific needs.
```
