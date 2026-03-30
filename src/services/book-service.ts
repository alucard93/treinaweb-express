import { BookRepository } from '../repositories/book-repository'
import { CreateBookBody, UpdateBookBody } from '../schemas/book-schema'

export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async createBook(book: CreateBookBody) {
    const data: {
      title: string
      isbn?: string
      publishedAt?: number
    } = {
      title: book.title,
    }

    if (book.isbn !== undefined) data.isbn = book.isbn

    if (book.publishedAt !== undefined) data.publishedAt = book.publishedAt

    return await this.bookRepository.createBook(data)
  }

  async getBooks() {
    return await this.bookRepository.getBooks()
  }

  async getBookById(id: string) {
    return await this.bookRepository.getBookById(id)
  }

  async updateBook(id: string, book: UpdateBookBody) {
    const data: {
      title?: string
      isbn?: string
      publishedAt?: number
    } = {}

    if (book.title !== undefined) data.title = book.title

    if (book.isbn !== undefined) data.isbn = book.isbn

    if (book.publishedAt !== undefined) data.publishedAt = book.publishedAt

    return await this.bookRepository.updateBook(id, data)
  }

  async deleteBook(id: string) {
    return await this.bookRepository.deleteBook(id)
  }
}
