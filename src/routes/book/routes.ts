import express, { Request, Response } from 'express'
import { makeBookController } from '../../factories/book/make-book-controller'
import {
  bookIdRequestSchema,
  createBookRequestSchema,
  updateBookRequestSchema,
} from '../../schemas/book-schema'
import { validate } from '../../middlewares/validate'

const router = express.Router()

const bookController = makeBookController()

router.post(
  '/book',
  validate(createBookRequestSchema),
  (req: Request, res: Response) => {
    bookController.createBook(req, res)
  },
)

router.get('/books', (req: Request, res: Response) => {
  bookController.getBooks(req, res)
})

router.get(
  '/book/:id',
  validate(bookIdRequestSchema),
  (req: Request, res: Response) => {
    bookController.getBookById(req, res)
  },
)

router.patch(
  '/book/:id',
  validate(updateBookRequestSchema),
  (req: Request, res: Response) => {
    bookController.updateBook(req, res)
  },
)

router.delete(
  '/book/:id',
  validate(bookIdRequestSchema),
  (req: Request, res: Response) => {
    bookController.deleteBook(req, res)
  },
)

export default router
