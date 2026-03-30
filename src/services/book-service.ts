import { Prisma } from '../../generated/prisma/client'
import { BookRepository } from '../repositories/book-repository'

export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async createBook(book: Prisma.BookCreateInput) {
    return await this.bookRepository.createBook(book)
  }

  async getBooks() {
    return await this.bookRepository.getBooks()
  }

  async getBookById(id: string) {
    return await this.bookRepository.getBookById(id)
  }

  async updateBook(id: string, book: Prisma.BookUpdateInput) {
    return await this.bookRepository.updateBook(id, book)
  }

  async deleteBook(id: string) {
    return await this.bookRepository.deleteBook(id)
  }
}
