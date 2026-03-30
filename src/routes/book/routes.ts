import express, { NextFunction, Request, Response } from 'express'
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
  (req: Request, res: Response, next: NextFunction) => {
    return bookController.createBook(req, res, next)
  },
)

router.get('/books', (req: Request, res: Response, next: NextFunction) => {
  return bookController.getBooks(req, res, next)
})

router.get(
  '/book/:id',
  validate(bookIdRequestSchema),
  (req: Request, res: Response, next: NextFunction) => {
    return bookController.getBookById(req, res, next)
  },
)

router.patch(
  '/book/:id',
  validate(updateBookRequestSchema),
  (req: Request, res: Response, next: NextFunction) => {
    return bookController.updateBook(req, res, next)
  },
)

router.delete(
  '/book/:id',
  validate(bookIdRequestSchema),
  (req: Request, res: Response, next: NextFunction) => {
    return bookController.deleteBook(req, res, next)
  },
)

export default router
