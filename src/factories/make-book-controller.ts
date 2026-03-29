import { BookController } from '../controllers/book-controllers'
import { prisma } from '../lib/prisma'
import { BookRepository } from '../repositories/book-repository'
import { BookService } from '../services/book-service'

export function makeBookController() {
  const bookRepository = new BookRepository(prisma)
  const bookService = new BookService(bookRepository)

  return new BookController(bookService)
}
