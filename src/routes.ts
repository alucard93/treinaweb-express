import express from 'express'
import { DATABASE_BOOKS } from './repositories/database'
import { loggerMiddleware } from './middlewares/middleware'

const router = express.Router()

router.use(loggerMiddleware)

router.post('/book', (req, res) => {
  const { title, year } = req.body

  const newBook = {
    id: DATABASE_BOOKS.length + 1,
    title,
    year,
  }

  DATABASE_BOOKS.push(newBook)

  res.status(201).json(newBook)
})

router.get('/book', (req, res) => {
  const year = Number(req.query.year)

  if (year) {
    const filteredBooks = DATABASE_BOOKS.filter((b) => b.year === year)
    return res.status(200).json(filteredBooks)
  }

  res.status(200).json(DATABASE_BOOKS)
})

router.get('/book/:id', (req, res) => {
  const { id } = req.params
  const book = DATABASE_BOOKS.find((b) => b.id === parseInt(id))

  if (!book) {
    return res.status(404).json({ messyear: 'Book not found' })
  }

  res.status(200).json(book)
})

router.delete('/book/:id', (req, res) => {
  const { id } = req.params
  const bookIndex = DATABASE_BOOKS.findIndex((b) => b.id === parseInt(id))
  if (bookIndex === -1) {
    return res.status(404).json({ messyear: 'Book not found' })
  }
  DATABASE_BOOKS.splice(bookIndex, 1)
  res.status(200).json({ messyear: 'Book deleted' })
})

router.patch('/book/:id', (req, res) => {
  const { id } = req.params
  const { title } = req.body
  const book = DATABASE_BOOKS.find((b) => b.id === parseInt(id))

  if (!book) {
    return res.status(404).json({ messyear: 'Book not found' })
  }
  if (title) {
    book.title = title
  }
  res.status(200).json(book)
})
export default router
