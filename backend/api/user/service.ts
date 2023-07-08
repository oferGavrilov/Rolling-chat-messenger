import { User } from "../../models/user.model"
import { generateToken } from "../../config/generateToken"
import { handleErrorService } from "../../middleware/errorMiddleware"

interface SignUpResult {
      error?: string
      user?: {
            _id: string
            username: string
            email: string
            profileImg: string
            about: string
            theme: string
            token: string
      }
}

export async function signUpUser (username: string, email: string, password: string, profileImg: string): Promise<SignUpResult> {
      try {
            if (!username || !email || !password) {
                  return { error: 'Please enter all fields' }
            }

            const userExists = await User.findOne({ email })

            if (userExists) {
                  return { error: 'User already exists' }
            }

            const newUser = await User.create({
                  username,
                  email,
                  password,
                  profileImg,
                  about: User.schema.path('about').default('Available'),
                  theme: User.schema.path('theme').default('light')
            })

            if (newUser) {
                  const user = {
                        _id: newUser._id,
                        username: newUser.username,
                        email: newUser.email,
                        profileImg: newUser.profileImg,
                        about: newUser.about,
                        theme: newUser.theme,
                        token: generateToken(newUser._id)
                  }

                  return { user }
            } else {
                  return { error: 'Invalid user data' }
            }
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function loginUser (email: string, password: string): Promise<{ user?: User, error?: string }> {
      try {
            const user = await User.findOne({ email }).select('+password')

            if (user && (await user.matchPassword(password))) {
                  return {
                        user,
                  }
            } else {
                  return {
                        error: 'Invalid email or password',
                  }
            }
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function searchUsers (keyword: string): Promise<User[]> {
      try {
            const clearString = keyword?.replace(/[\/>]/g, '')

            const filter = clearString ? {
                  $or: [
                        { username: { $regex: clearString, $options: 'i' } },
                        { email: { $regex: clearString, $options: 'i' } }
                  ]
            } : {}

            const users = await User.find({ ...filter })
            return users
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function getAllUsers (userId: string): Promise<User[]> {
      try {
            const users = await User.find({ _id: { $ne: userId } })
            return users
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function editUserDetailsService (userId: string, newName: string): Promise<User | null> {
      try {
            const user = await User.findById(userId)

            console.log('user:', user)
            if (user) {
                  user.username = newName
                  await user.save()
                  return user
            }

            return null
      } catch (error: any) {
            throw handleErrorService(error)
      }
}

export async function editUserImageService (userId: string, newImage: string): Promise<string | null> {
      try {
            const user = await User.findById(userId)

            if (user) {
                  user.profileImg = newImage
                  await user.save()
                  return user.profileImg
            }

            return null
      } catch (error: any) {
            throw handleErrorService(error)
      }
}