import { Router } from 'express';
import { ResponseDto } from '../dto/response/ResponseDto';
import { listRouter } from './list/ListRouter';
import { NotFound } from '../errors/http/NotFound';


/**
 * Simple responser placeholder
 * @param {Request} req
 * @param {Response} res
*/
async function sayHelloWorld(req, res) {
  const response = new ResponseDto(200, 'Hello World',  {
    message : 'Hello World',
  });
  
  res.status(200).json(response);
}

// start of routes
const routes = new Router();
routes.get('/', sayHelloWorld);
routes.use('/list', listRouter);

// Catch-all route for handling 404 errors
routes.use((req, res, next) => {
  throw new NotFound('Route doesn\'t exist');
});

export default routes;