import express from 'express';
import { signUp, login, getUsers, editUserDetails, editUserImage, logoutUser, sendResetPasswordMail, resetPassword } from './controller.js';
import { authMiddleware } from '../../middleware/authMiddleware.js';
export const router = express.Router();
router.get('/all', authMiddleware, getUsers);
router.post('/signup', signUp);
router.post('/login', login);
router.put('/logout', logoutUser);
router.put('/details', authMiddleware, editUserDetails);
router.put('/image', authMiddleware, editUserImage);
router.post('/send-reset-password-mail', sendResetPasswordMail);
router.post('/reset-password', resetPassword);
//# sourceMappingURL=router.js.map