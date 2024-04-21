import cors from 'cors'
import express, { Express, NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import rateLimiter from '@/middleware/rateLimiter'
import requestLogger from '@/middleware/requestLogger'
import errorHandler from '@/middleware/errorMiddleware'
import { pino } from 'pino'
import { env } from '@/utils/envConfig'

import bodyParser from 'body-parser'
import http from 'http'
import cookieParser from 'cookie-parser'
import CleanupService from '@/utils/cleanup'

import { connectDB } from '@/config/db'

import { authRouter } from './api/routes/auth.routes'
import { chatRouter } from './api/routes/chat.routes'
import { messageRouter } from './api/routes/message.routes'
import { userRouter } from './api/routes/user.routes'

import { socketAPI } from '@/sockets/socketServer'

const logger = pino({ name: 'server start' })

const app: Express = express()
app.set('trust proxy', true)

// Middlewares
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet())
app.use(rateLimiter)

// Request Logger
app.use(requestLogger())

connectDB()
const server = http.createServer(app)
app.use(express.json({ limit: '3mb' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
new CleanupService()

// Routes
socketAPI(server)
app.use('/api/auth', authRouter)
app.use('/api/chat', chatRouter)
app.use('/api/message', messageRouter)
app.use('/api/user', userRouter)

app.get('/', (_: express.Request, res: express.Response) => {
    res.send('Rolling Chat API is running!')
})

// UNHANDLED ROUTES
app.all('*', async (req: Request, res: Response, next: NextFunction) => {
    const err = new Error(`Can't find ${req.originalUrl} on this server!`)
    err['statusCode'] = 404
    next(err)
})

// Error handler
app.use(errorHandler())

export { server, logger }
