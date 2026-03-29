import { Request, Response } from 'express'
import { BookService } from '../services/book-service'

export class BookController {
  constructor(private bookService: BookService) {}

  async createBook(req: Request, res: Response) {
    try {
      const bookData = req.body
      const newBook = await this.bookService.createBook(bookData)
      return res.status(201).json(newBook)
    } catch (error) {
      console.error('Failed to create book', error)
      return res.status(500).json({ error: 'Failed to create book' })
    }
  }

  async getBooks(req: Request, res: Response) {
    try {
      const books = await this.bookService.getBooks()
      return res.status(200).json(books)
    } catch (error) {
      console.error('Failed to get books', error)
      return res.status(500).json({ error: 'Failed to get books' })
    }
  }
}
