import express, { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import http from 'http'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'

import { chats } from '../data/dummyData'

const app = express()
dotenv.config()
const server = http.createServer(app)

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())


if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.resolve(__dirname, 'public')))
} else {
      const corsOptions = {
            origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
            credentials: true
      }
      app.use(cors(corsOptions))
}



app.get('/', (req: Request, res: Response) => {
      res.send(new Date().toLocaleTimeString())
})

app.get('/api/chat', (req: Request, res: Response) => {
      res.send(chats)
})

app.get('/api/chat/:id', (req: Request, res: Response) => {
      const signleChat  = chats.find(chat => chat._id === req.params.id)
      res.send(signleChat)
})

// app.get('/**', (req, res) => {
//       res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })

const port = process.env.PORT || 5000

server.listen(port, () => console.log(`Example app listening on port ${port}!`))