import { NextFunction, Request, Response } from 'express'
import { BookService } from '../services/book-service'

export class BookController {
  constructor(private bookService: BookService) {}

  async createBook(req: Request, res: Response, next: NextFunction) {
    try {
      const newBook = await this.bookService.createBook(req.body)
      return res.status(201).json(newBook)
    } catch (error) {
      return next(error)
    }
  }

  async getBooks(req: Request, res: Response, next: NextFunction) {
    try {
      const books = await this.bookService.getBooks()
      return res.status(200).json(books)
    } catch (error) {
      return next(error)
    }
  }

  async getBookById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const book = await this.bookService.getBookById(id as string)
      return res.status(200).json(book)
    } catch (error) {
      return next(error)
    }
  }

  async updateBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const body = req.body
      const updatedBook = await this.bookService.updateBook(
        id as string,
        body,
      )
      return res.status(200).json(updatedBook)
    } catch (error) {
      return next(error)
    }
  }

  async deleteBook(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      await this.bookService.deleteBook(id as string)
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}
