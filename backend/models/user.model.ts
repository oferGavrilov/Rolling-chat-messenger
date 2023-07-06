import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface User extends Document {
  username: string
  email: string
  password: string
  profileImg: string
  about: string
  theme: string
  matchPassword: (enteredPassword: string) => Promise<boolean>
  createdAt: Date
  updatedAt: Date
}

const userModel: Schema<User> = new Schema<User>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    profileImg: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
    about: { type: String, default: "Available" },
    theme: { type: String, default: "light" },
  },
  { timestamps: true }
)

userModel.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password)
}

userModel.pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

export const User = mongoose.model<User>('User', userModel)
