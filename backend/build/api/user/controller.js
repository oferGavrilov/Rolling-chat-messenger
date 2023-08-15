var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { generateToken } from "../../config/generateToken";
import { editUserDetailsService, editUserImageService, getUsersService, loginUser, searchUsers, signUpUser, updateUserStatus } from "./service";
import { handleErrorService } from "../../middleware/errorMiddleware";
export function signUp(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, email, password, profileImg } = req.body;
        try {
            const result = yield signUpUser(username, email, password, profileImg);
            if (result.error) {
                return res.status(400).json({ msg: result.error });
            }
            const { user } = result;
            if (user) {
                return res.status(201).json(Object.assign(Object.assign({}, result.user), { isOnline: true }));
            }
        }
        catch (error) {
            console.error('Error during sign up:', error);
            return res.status(500).json({ msg: 'Internal server error' });
        }
    });
}
export function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const result = yield loginUser(email, password);
            if (result.error) {
                return res.status(401).json({ msg: result.error });
            }
            const { user } = result;
            if (user) {
                res.json({
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    profileImg: user.profileImg,
                    about: user.about,
                    token: generateToken(user._id),
                    isOnline: true,
                });
            }
            else {
                throw new Error('User not found');
            }
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function logoutUser(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        try {
            yield updateUserStatus(userId);
            res.status(200).json({ message: 'User logged out successfully' });
        }
        catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    });
}
export function searchUsersByKeyword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { search } = req.query;
        const keyword = (search === null || search === void 0 ? void 0 : search.toString()) || '';
        try {
            const users = yield searchUsers(keyword);
            res.send(users);
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function getUsers(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const loggedInUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const { userId } = req.params;
        try {
            const users = yield getUsersService(loggedInUserId, userId);
            res.send(users);
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function editUserDetails(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { newName } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        try {
            const newNameToSave = newName === null || newName === void 0 ? void 0 : newName.replace(/[\/>]/g, '').trim();
            const user = yield editUserDetailsService(userId, newNameToSave);
            if (user) {
                res.send(user);
            }
            else {
                res.status(404).json({ msg: 'User not found' });
            }
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function editUserImage(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const { image } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        try {
            const user = yield editUserImageService(userId, image);
            if (user) {
                res.send(user);
            }
            else {
                res.status(404).json({ msg: 'User not found' });
            }
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
//# sourceMappingURL=controller.js.map