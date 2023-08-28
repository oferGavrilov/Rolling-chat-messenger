import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { Chat } from '../models/chat.model.js';
import { Message } from '../models/message.model.js';
export async function authMiddleware(req, res, next) {
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
export async function groupAdminMiddleware(req, res, next) {
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
export async function checkMessageOwnership(req, res, next) {
    const { messageId } = req.params;
    let token;
    try {
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Not authorized, no token' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
        }
        const message = await Message.findById(messageId);
        if (!message) {
            return res.status(404).json({ message: "Message not found" });
        }
        if (message.sender.toString() !== req.user?._id.toString()) {
            return res.status(403).json({ message: "You do not have permission to delete this message" });
        }
        next();
    }
    catch (error) {
        return res.status(500).json({ message: "An error occurred" });
    }
}
//# sourceMappingURL=authMiddleware.js.map