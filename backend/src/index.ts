import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import http from 'http'
import cookieParser from 'cookie-parser'
import CleanupService from './services/cleanup.service.js'

import { connectDB } from './config/db.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'

const app = express()
connectDB()
const server = http.createServer(app)
app.use(express.json({ limit: '50mb' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
new CleanupService()

import { router as authRouter } from './api/auth/router.js'
import { router as userRoutes } from './api/user/router.js'
import { router as chatRoutes } from './api/chat/router.js'
import { router as messageRoutes } from './api/message/router.js'
import { router as galleryRoutes } from './api/gallery/router.js'
import { setupSocketAPI } from './services/socket.service.js'
import logger from './services/logger.service.js'

logger.info(`Environment: ${process.env.NODE_ENV}`)

if (process.env.NODE_ENV === 'production') {
      app.use(cors({ origin: ['https://rolling-chat-messenger.vercel.app' , 'https://www.rolling-chat.com'], credentials: true }));
} else {
      app.use(cors({ origin: true, credentials: true }));
}

setupSocketAPI(server)
app.use('/api/auth', authRouter)
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)
app.use('/api/gallery', galleryRoutes)

app.get('/', (_: express.Request, res: express.Response) => {
      res.send('How You Doinn :)')
})
app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000

server.listen(port, () => logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${port}`))

export default app
