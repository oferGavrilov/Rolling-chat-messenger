import mongoose, { type Mongoose } from 'mongoose'
import logger from '../services/logger.service'

let connection: Mongoose | null = null

export const connectDB = async (): Promise<void> => {
      logger.info('Connecting to MongoDB...')
      
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

            logger.info(`MongoDB environment: ${connection.connection.host}`)
      } catch (error: unknown) {
            if (error instanceof Error) {
                  logger.error(`Error: ${error.message}`)
            } else {
                  logger.error(`Error: ${error}`)
            }

            process.exit(1)
      }
}

export const disconnectDB = async (): Promise<void> => {
      if (connection) {
            await connection.disconnect();
            logger.info('MongoDB Disconnected')
      }
};