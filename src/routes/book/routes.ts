import express, { Request, Response } from 'express'
import { makeBookController } from '../../factories/book/make-book-controller'

const router = express.Router()

const bookController = makeBookController()

router.post('/book', (req: Request, res: Response) => {
  bookController.createBook(req, res)
})

router.get('/books', (req: Request, res: Response) => {
  bookController.getBooks(req, res)
})

export default router
