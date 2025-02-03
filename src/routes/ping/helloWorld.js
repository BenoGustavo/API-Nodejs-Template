import { ResponseDto } from '../../dto/response/ResponseDto';

/**
 * Simple responser placeholder
 * @param {Request} req
 * @param {Response} res
*/
export async function sayHelloWorld(req, res) {
    const response = new ResponseDto(200, 'Hello World',  {
      message : 'Hello World',
    });
    
    res.status(200).json(response);
  }