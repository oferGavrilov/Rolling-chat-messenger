import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import path from 'path'
import http from 'http'
import cookieParser from 'cookie-parser'
import requestIp from 'request-ip'

import router from './api/routes.js'

const app = express()
const server = http.createServer(app)

app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(requestIp.mw())

const port = 5000


if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.resolve(__dirname, 'public')))
} else {
      const corsOptions = {
            origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
            credentials: true
      }
      app.use(cors(corsOptions))
}



app.get('/api/time', (_, res) => {
      res.send(new Date().toLocaleTimeString())
})

// app.get('/**', (req, res) => {
//       res.sendFile(path.join(__dirname, 'public', 'index.html'))
// })


app.use('/api' , router)


server.listen(port, () => console.log(`Example app listening on port ${port}!`))