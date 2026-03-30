import express from 'express'
import { errorHandler } from './middlewares/error-handler'
import bookRouter from './routes/book/routes'
import publisherRouter from './routes/publisher/routes'
import authorRouter from './routes/author/routes'

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use('/', bookRouter)
app.use('/', publisherRouter)
app.use('/', authorRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
