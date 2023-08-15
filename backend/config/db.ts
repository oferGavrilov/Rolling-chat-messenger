import mongoose, { type Mongoose } from 'mongoose'

let connection: Mongoose | null = null

export const connectDB = async (): Promise<void> => {
      console.log('Connecting to MongoDB...')
      console.log('MongoUri', process.env.MONGO_ATLAS_URI)
      
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

            connection = await mongoose.connect(mongoURI)

            console.log(`MongoDB Connected: ${connection.connection.host}`)
      } catch (error: any) {
            console.error(`Error: ${error.message}`)
            process.exit(1)
      }
}

export const disconnectDB = async (): Promise<void> => {
      if (connection) {
            await connection.disconnect();
            console.log('MongoDB Disconnected');
      }
};