import express from 'express'
import { errorHandler } from './middlewares/error-handler'
import router from './routes/book/routes'

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use('/', router)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
