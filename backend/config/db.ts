import mongoose from 'mongoose'

export const connectDB = async () => {
      console.log('Connecting to MongoDB...')
      try {
            const mongoURI = process.env.MONGO_URI;
            if (!mongoURI) {
                  throw new Error('MongoDB connection URI is not defined');
            }

            const conn = await mongoose.connect(mongoURI);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
      } catch (error: any) {
            console.error(`Error: ${error.message}`);
            process.exit(1);
      }
}