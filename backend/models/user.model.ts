import mongoose from 'mongoose'

const userModel = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      profilePicUrl: { type: String, required: true, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
},
      { timestamps: true }
)

export const User = mongoose.model('User', userModel)