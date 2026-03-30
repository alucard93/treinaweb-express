import { Request, Response } from 'express'
import { BookService } from '../services/book-service'

export class BookController {
  constructor(private bookService: BookService) {}

  async createBook(req: Request, res: Response) {
    try {
      const newBook = await this.bookService.createBook(req.body)
      return res.status(201).json(newBook)
    } catch (error) {
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
      const book = await this.bookService.getBookById(id as string)
      return res.status(200).json(book)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get book' })
    }
  }

  async updateBook(req: Request, res: Response) {
    try {
      const { id } = req.params
      const body = req.body
      const updatedBook = await this.bookService.updateBook(
        id as string,
        body,
      )
      return res.status(200).json(updatedBook)
    } catch (error) {
      return res.status(500).json({ error: 'Failed to update book' })
    }
  }

  async deleteBook(req: Request, res: Response) {
    try {
      const { id } = req.params
      await this.bookService.deleteBook(id as string)
      return res.status(204).send()
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete book' })
    }
  }
}
