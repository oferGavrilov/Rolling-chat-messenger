import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import http from 'http'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

import { fileURLToPath } from 'url' 
import { connectDB } from '../config/db'
import { logger } from './services/logger.service'

import { notFound } from '../middleware/errorMiddleware'
import { errorHandler } from '../middleware/errorMiddleware'

import { router as userRoutes } from '../api/user/router'
import { router as chatRoutes } from '../api/chat/router'
import { router as messageRoutes } from '../api/message/router'
import { setupSocketAPI } from './services/socket.service'

const app = express()
dotenv.config()
connectDB()
const server = http.createServer(app)

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

const currentFilePath = fileURLToPath(import.meta.url)
const __dirname = path.dirname(currentFilePath)

console.log(process.env.NODE_ENV)

if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.resolve(__dirname, '../build')))

      const corsOptions = {
            origin: 'https://rolling-chat.netlify.app',
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

server.listen(port, () => logger.info(`Server running on port ${port}!`))

export default app
