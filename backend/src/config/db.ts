import mongoose, { type Mongoose } from 'mongoose'
import { logger } from '@/server'
import { env } from '@/utils/envConfig'

let connection: Mongoose | null = null

export const connectDB = async (): Promise<void> => {
      logger.info('Connecting to MongoDB...')

      try {
            let mongoURI = ''
            mongoURI = env.MONGO_URI
            console.log('mongoURI', mongoURI)
            if (!mongoURI) {
                  throw new Error('MongoDB connection URI is not defined')
            }

            connection = await mongoose.connect(mongoURI)

            logger.info(`MongoDB environment: ${connection.connection.host}`)
      } catch (error: unknown) {
            const errorMessage = `Error connecting to MongoDB: ${(error as Error).message} the MONGO_URI is ${env.MONGO_URI}`
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
