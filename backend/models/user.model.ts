import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

interface User {
      username: string,
      email: string,
      password: string,
      profileImg: string,
      matchPassword: (enteredPassword: string) => Promise<boolean>
      createdAt: Date,
      updatedAt: Date
}

const userModel: Schema<User> = new mongoose.Schema({
      username: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      profileImg: { type: String, default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" },
},
      { timestamps: true }
)

userModel.methods.matchPassword = async function (enteredPassword: string) {
      return await bcrypt.compare(enteredPassword, this.password)
}

userModel.pre('save', async function (next) {
      if (!this.isModified('password')) {
            next()
      }
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
})

export const User = mongoose.model<User>('User', userModel)