import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { Chat } from '../models/chat.model.js';
export async function protect(req, res, next) {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!token) {
                throw new Error('No token provided');
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        }
        catch (error) {
            console.error('this', error);
            res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token' });
    }
}
export async function admin(req, res, next) {
    const { chatId } = req.body;
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ msg: 'Not authorized, no token' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            const chat = await Chat.findById(chatId);
            if (chat && chat.groupAdmin && chat.groupAdmin.toString() === req.user?._id.toString()) {
                next();
            }
            else {
                return res.status(401).json({ msg: 'Not authorized as an admin' });
            }
        }
        catch (error) {
            console.error(error);
            return res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }
}
//# sourceMappingURL=authMiddleware.js.map