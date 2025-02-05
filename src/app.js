import 'dotenv/config';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import './database/Connection';
import routes from './routes';
import { GlobalErrorHandler } from './middlewares/GlobalErrorHandler'; 
import { swaggerMiddleware } from './middlewares/SwaggerMiddleware';

/**
 * Base app - class based.
 */
class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.errorHandling();
  }

  /**
   * Application middlewares definition (to every request)
   */
  middlewares() {
    this.server.disable('x-powered-by');
    this.server.use(cors());
    this.server.use(express.json());

    // Swagger documentation route
    this.server.use('/api/docs', swaggerMiddleware);
  }

  /**
   * Base routes definition
   */
  routes() {
    this.server.use(process.env.NAMESPACING, routes);
  }

  /**
   * Error handling middleware
   */
  errorHandling() {
    this.server.use((err, req, res, next) => {
      console.error(
        `❌ Error ❌: ${err.message}\n⚠️ Stack ⚠️: ${err.stack} \n`
      )
      GlobalErrorHandler(err, req, res, next);
    });
  }
}

export default new App().server;