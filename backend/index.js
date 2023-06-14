import express from 'express'
import cors from 'cors'

const app = express()

const port = 5000

app.use(cors())



app.get('/', (_, res) => {
      res.send('The local time on this machine: ' + new Date().toLocaleTimeString())
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))