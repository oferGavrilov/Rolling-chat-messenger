var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { Chat } from '../models/chat.model';
export function protect(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                token = req.headers.authorization.split(' ')[1];
                if (!token) {
                    throw new Error('No token provided');
                }
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = yield User.findById(decoded.id).select('-password');
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
    });
}
export function admin(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { chatId } = req.body;
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                token = req.headers.authorization.split(' ')[1];
                if (!token) {
                    return res.status(401).json({ msg: 'Not authorized, no token' });
                }
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = yield User.findById(decoded.id).select('-password');
                const chat = yield Chat.findById(chatId);
                if (chat && chat.groupAdmin && chat.groupAdmin.toString() === ((_a = req.user) === null || _a === void 0 ? void 0 : _a._id.toString())) {
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
    });
}
//# sourceMappingURL=authMiddleware.js.map