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

  async getBookById(req: Request, res: Response) {
    try {
      const { id } = req.params

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid book id' })
      }

      const book = await this.bookService.getBookById(id)
      if (!book) {
        return res.status(404).json({ error: 'Book not found' })
      }
      return res.status(200).json(book)
    } catch (error) {
      console.error('Failed to get book', error)
      return res.status(500).json({ error: 'Failed to get book' })
    }
  }

  async updateBook(req: Request, res: Response) {
    try {
      const { id } = req.params
      const bookData = req.body

      if (typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid book id' })
      }
      
      const updatedBook = await this.bookService.updateBook(id, bookData)
      return res.status(200).json(updatedBook)
    } catch (error) {
      console.error('Failed to update book', error)
      return res.status(500).json({ error: 'Failed to update book' })
    }
  }
}
