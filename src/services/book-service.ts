import { BookRepository } from '../repositories/book-repository'
import { BookNotFoundError } from '../errors/book-not-found-error'
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
    const book = await this.bookRepository.getBookById(id)

    if (!book) {
      throw new BookNotFoundError(id)
    }

    return book
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

    const updatedBook = await this.bookRepository.updateBook(id, data)

    if (!updatedBook) {
      throw new BookNotFoundError(id)
    }

    return updatedBook
  }

  async deleteBook(id: string) {
    const deleted = await this.bookRepository.deleteBook(id)

    if (!deleted) {
      throw new BookNotFoundError(id)
    }
  }
}
