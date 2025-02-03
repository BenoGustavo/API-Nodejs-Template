import { Router } from 'express';
import { NotFound } from '../errors/http/NotFound';
import { sayHelloWorld } from './ping/helloWorld';

// Routers
import { listRouter } from './list/ListRouter';
import { toDoRouter } from './todos/ToDoRouter';

// start of routes
const routes = new Router();
routes.get('/', sayHelloWorld);
routes.use('/list', listRouter);
routes.use('/todo', toDoRouter);

// Catch-all route for handling 404 errors
routes.use((req, res, next) => {
  throw new NotFound('Route doesn\'t exist');
});

export default routes;