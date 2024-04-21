import mongoose, { Schema, Document, Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import { env } from '@/utils/envConfig'

export interface IUser extends Document {
  _id: string
  username: string
  email: string
  password: string
  profileImg: string
  TN_profileImg: string
  about: string
  verifyPassword: (enteredPassword: string) => Promise<boolean>
  isOnline: boolean
  lastSeen: Date
  resetPasswordToken?: string | null
  resetPasswordExpires?: Date | null
  refreshToken?: string
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  profileImg: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
  TN_profileImg: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
  about: { type: String, default: "Available" },
  isOnline: { type: Boolean, default: false },
  lastSeen: { type: Date, default: Date.now() },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: {type:Date, default: null},
  refreshToken: String
},
  { timestamps: true }
)

export const DEFAULT_GUEST_IMAGE = './imgs/guest.jpg'

userSchema.methods.verifyPassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const SALT_ROUNDS = parseInt(env.SALT_ROUNDS as string || '10')
  const salt = await bcrypt.genSalt(SALT_ROUNDS)
  this.password = await bcrypt.hash(this.password, salt)
})

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema)
