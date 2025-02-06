import { Router } from 'express';
import { NotFound } from '../errors/http/NotFound';
import { sayPong } from './ping/pong';

// Routers
import { listRouter } from './list/ListRouter';
import { toDoRouter } from './todos/ToDoRouter';
import { userRouter } from './user/UserRouter';

// start of routes
const routes = new Router();
routes.get('/ping', sayPong);
routes.use('/list', listRouter);
routes.use('/todo', toDoRouter);
routes.use('/user', userRouter);

// Catch-all route for handling 404 errors
routes.use((req, res, next) => {
  throw new NotFound('Route doesn\'t exist');
});

export default routes;