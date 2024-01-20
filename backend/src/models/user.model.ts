import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface User extends Document {
  username: string
  email: string
  password: string
  profileImg: string
  about: string
  verifyPassword: (enteredPassword: string) => Promise<boolean>
  createdAt: Date
  updatedAt: Date
  isOnline: boolean
  lastSeen: Date
  token?: string
  resetPasswordToken?: string
  resetPasswordExpires?: Date
}

const userSchema: Schema<User> = new Schema<User>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    profileImg: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
    about: { type: String, default: "Available" },
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now() },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  },
  { timestamps: true }
)

userSchema.methods.verifyPassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}
userSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

export const User = mongoose.model<User>('User', userSchema)
