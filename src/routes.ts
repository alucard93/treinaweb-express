import express, { Request, Response } from 'express'
import { prisma } from './lib/prisma'
import { BookService } from './services/book-service'
import { BookRepository } from './repositories/book-repository'
import { BookController } from './controllers/book-controllers'

const router = express.Router()

const bookRepository = new BookRepository(prisma)
const bookService = new BookService(bookRepository)
const bookController = new BookController(bookService)

router.post('/book', (req: Request, res: Response) => {
  bookController.createBook(req, res)
})

export default router
