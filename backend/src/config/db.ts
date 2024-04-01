import mongoose, { type Mongoose } from 'mongoose'
import { logger } from '@/server'
import { env } from '@/utils/envConfig'

let connection: Mongoose | null = null

export const connectDB = async (): Promise<void> => {
      logger.info('Connecting to MongoDB...')

      try {
            let mongoURI = ''
            mongoURI = env.MONGO_URI

            if (!mongoURI) {
                  throw new Error('MongoDB connection URI is not defined')
            }

            connection = await mongoose.connect(mongoURI)

            logger.info(`MongoDB environment: ${connection.connection.host}`)
      } catch (error: unknown) {
            const errorMessage = `Error connecting to MongoDB: ${(error as Error).message}`
            logger.error(errorMessage)

            process.exit(1)
      }
}

export const disconnectDB = async (): Promise<void> => {
      if (connection) {
            await connection.disconnect()
            logger.info('MongoDB Disconnected')
      }
}