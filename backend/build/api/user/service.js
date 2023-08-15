var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { User } from "../../models/user.model.js";
import { generateToken } from "../../config/generateToken.js";
import { handleErrorService } from "../../middleware/errorMiddleware.js";
export function signUpUser(username, email, password, profileImg) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!username || !email || !password) {
                return { error: 'Please enter all fields' };
            }
            const userExists = yield User.findOne({ email });
            if (userExists) {
                return { error: 'User already exists' };
            }
            const newUser = yield User.create({
                username,
                email,
                password,
                profileImg,
                isOnline: true,
                about: User.schema.path('about').default('Available'),
            });
            if (newUser) {
                const user = {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    profileImg: newUser.profileImg,
                    about: newUser.about,
                    token: generateToken(newUser._id),
                };
                return { user };
            }
            else {
                return { error: 'Invalid user data' };
            }
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function loginUser(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield User.findOne({ email }).select('+password');
            if (user && (yield user.matchPassword(password))) {
                user.isOnline = true;
                yield user.save();
                return {
                    user,
                };
            }
            else {
                return {
                    error: 'Invalid email or password',
                };
            }
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function updateUserStatus(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Find the user by ID and update the isOnline and lastSeen properties
            yield User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() }, { new: true } // Set { new: true } to return the updated user after the update
            );
        }
        catch (error) {
            throw error;
        }
    });
}
export function searchUsers(keyword) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const clearString = keyword === null || keyword === void 0 ? void 0 : keyword.replace(/[\/>]/g, '');
            const filter = clearString ? {
                $or: [
                    { username: { $regex: clearString, $options: 'i' } },
                    { email: { $regex: clearString, $options: 'i' } }
                ]
            } : {};
            const users = yield User.find(Object.assign({}, filter));
            return users;
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function getUsersService(loggedInUserId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (userId) {
                const user = yield User.findOne({ _id: userId });
                if (!user) {
                    throw new Error('User not found');
                }
                return [user];
            }
            else {
                const users = yield User.find({ _id: { $ne: loggedInUserId } });
                return users;
            }
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function editUserDetailsService(userId, newName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield User.findById(userId);
            console.log('user:', user);
            if (user) {
                user.username = newName;
                yield user.save();
                return user;
            }
            return null;
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
export function editUserImageService(userId, newImage) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield User.findById(userId);
            if (user) {
                user.profileImg = newImage;
                yield user.save();
                return user.profileImg;
            }
            return null;
        }
        catch (error) {
            throw handleErrorService(error);
        }
    });
}
//# sourceMappingURL=service.js.map