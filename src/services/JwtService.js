import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default_test_secret';

if (JWT_SECRET === 'default_test_secret') {
    console.warn('\n⚠️ USING DEFAULT JWT SECRET, PLEASE SET A UNIQUE SECRET IN PRODUCTION. ⚠️\n');
}

export class JwtService {
    static generateToken(user) {
        return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
            expiresIn: '1h',
        });
    }

    static verifyToken(token) {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}