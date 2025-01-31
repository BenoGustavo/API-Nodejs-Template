import { Router } from 'express';
import { ResponseDto } from '../dto/response/ResponseDto'

const routes = new Router();

/**
 * Simple responser
 * @param {Request} req
 * @param {Response} res
 */
async function baseResponser(req, res) {
  const response = new ResponseDto(200, 'Hello World',  {
    name : 'Hello World',
    message : 'Hello World',
    something : 'Hello World'
  });

  res.status(200).json(response);
}

routes.get('/', baseResponser);

export default routes;