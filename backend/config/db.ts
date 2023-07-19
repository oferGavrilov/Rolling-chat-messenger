import mongoose, { type Mongoose } from 'mongoose'

export const connectDB = async (): Promise<void> => {
      console.log('Connecting to MongoDB...')
      try {
            let mongoURI
            if (process.env.NODE_ENV === 'production') {
                  mongoURI = process.env.MONGO_ATLAS_URI
            } else {
                  mongoURI = process.env.MONGO_LOCAL_URI
            }

            if (!mongoURI) {
                  throw new Error('MongoDB connection URI is not defined')
            }

            const conn: Mongoose = await mongoose.connect(mongoURI)

            console.log(`MongoDB Connected: ${conn.connection.host}`)
      } catch (error: any) {
            console.error(`Error: ${error.message}`)
            process.exit(1)
      }
}
