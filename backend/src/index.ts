import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
// import path from 'path'
import http from 'http'
import cookieParser from 'cookie-parser'
import CleanupService from './services/cleanup.service.js'

// import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'

import { notFound } from './middleware/errorMiddleware.js'
import { errorHandler } from './middleware/errorMiddleware.js'

const app = express()
connectDB()
const server = http.createServer(app)
app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
new CleanupService()

import { router as userRoutes } from './api/user/router.js'
import { router as chatRoutes } from './api/chat/router.js'
import { router as messageRoutes } from './api/message/router.js'
import { setupSocketAPI } from './services/socket.service.js'
import logger from './services/logger.service.js'

// const currentFilePath = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(currentFilePath)

logger.info(`Environment: ${process.env.NODE_ENV}`)

if (process.env.NODE_ENV === 'production') {
      // app.use(express.static(path.resolve(__dirname, '../build')))

      const corsOptions = {
            origin: ['https://rolling-chat-messenger.vercel.app','http://127.0.0.1:3000', 'http://localhost:3000'],
            credentials: true,
      }
      app.use(cors(corsOptions))
} else {
      const corsOptions = {
            origin: ['http://127.0.0.1:3000', 'http://localhost:3000'],
            credentials: true,
      }
      app.use(cors(corsOptions))
}

app.use('/api/auth', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
setupSocketAPI(server)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000

server.listen(port, () => logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${port}`))

export default app
