import { Prisma } from '../../generated/prisma/client'
import { BookRepository } from '../repositories/book-repository'

export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async createBook(book: Prisma.BookCreateInput) {
    return await this.bookRepository.createBook(book)
  }
}
