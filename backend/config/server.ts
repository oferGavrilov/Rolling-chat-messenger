import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import express from "express";

import { notFound } from '../middleware/errorMiddleware'
import { errorHandler } from '../middleware/errorMiddleware'

import { router as userRoutes } from '../api/user/router'
import { router as chatRoutes } from '../api/chat/router'
import { router as messageRoutes } from '../api/message/router'
import { setupSocketAPI } from '../src/services/socket.service'
import http from "http";
import dotenv from "dotenv";
import { connectDB } from "./db";

function createServer () {
      const app = express()
      dotenv.config()
      connectDB()
      const server = http.createServer(app)

      app.use(express.json())
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: false }))
      app.use(cookieParser())


      app.use('/api/auth', userRoutes)
      app.use('/api/chat', chatRoutes)
      app.use('/api/message', messageRoutes)
      setupSocketAPI(server)

      // app.use(notFound)
      // app.use(errorHandler)


      return app
}

export default createServer