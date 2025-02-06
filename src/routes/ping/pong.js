/**
 * Ping Pong
 * @param {Request} req
 * @param {Response} res
*/
export async function sayPong(req, res) {
    
    res.status(200).json({message: 'Pong!'});
  }