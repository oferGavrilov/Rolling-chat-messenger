import jwt from 'jsonwebtoken';
export const generateToken = (id) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT secret is not defined');
    }
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: '30d'
    });
};
