import { JwtService } from '../services/JwtService';

/**
 * Validates the token in the Authorization header
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
export const authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = JwtService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token.' });
    }
};