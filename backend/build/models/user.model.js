import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
const userModel = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    profileImg: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
    about: { type: String, default: "Available" },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now() }
}, { timestamps: true });
userModel.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
userModel.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
export const User = mongoose.model('User', userModel);
//# sourceMappingURL=user.model.js.map