import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import http from 'http'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { connectDB } from '../config/db'

import { notFound } from '../middleware/errorMiddleware'
import { errorHandler } from '../middleware/errorMiddleware'

import { router as userRoutes } from '../api/user/router'

const app = express()
dotenv.config()
connectDB()
const server = http.createServer(app)

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())


if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.resolve(__dirname, 'public')))
} else {
      const corsOptions = {
            origin: ['http://127.0.0.1:5000', 'http://localhost:5000'],
            credentials: true
      }
      app.use(cors(corsOptions))
}



app.get('/', (req: Request, res: Response) => {
      res.send(new Date().toLocaleTimeString())
})

app.use(notFound)
app.use(errorHandler)

app.use('/api/auth', userRoutes)

const port = process.env.PORT || 5000

server.listen(port, () => console.log(`Example app listening on port ${port}!`))