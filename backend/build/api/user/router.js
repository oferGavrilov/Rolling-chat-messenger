import express from 'express';
import { signUp, login, getUsers, searchUsersByKeyword, editUserDetails, editUserImage, logoutUser } from './controller.js';
import { protect } from '../../middleware/authMiddleware.js';
export const router = express.Router();
router.post('/signup', signUp);
router.post('/login', login);
router.put('/logout', protect, logoutUser);
router.get('/', protect, searchUsersByKeyword);
router.get('/all/:userId?', protect, getUsers);
router.put('/details', protect, editUserDetails);
router.put('/image', protect, editUserImage);
//# sourceMappingURL=router.js.map