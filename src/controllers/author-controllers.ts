import { NextFunction, Request, Response } from 'express'
import { AuthorService } from '../services/author-service'

export class AuthorController {
  constructor(private authorService: AuthorService) {}

  async createAuthor(req: Request, res: Response, next: NextFunction) {
    try {
      const newAuthor = await this.authorService.createAuthor(req.body)
      return res.status(201).json(newAuthor)
    } catch (error) {
      return next(error)
    }
  }

  async getAuthors(req: Request, res: Response, next: NextFunction) {
    try {
      const authors = await this.authorService.getAuthors()
      return res.status(200).json(authors)
    } catch (error) {
      return next(error)
    }
  }

  async getAuthorById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const author = await this.authorService.getAuthorById(id as string)
      return res.status(200).json(author)
    } catch (error) {
      return next(error)
    }
  }

  async updateAuthor(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const author = await this.authorService.updateAuthor(
        id as string,
        req.body,
      )
      return res.status(200).json(author)
    } catch (error) {
      return next(error)
    }
  }

  async deleteAuthor(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      await this.authorService.deleteAuthor(id as string)
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}
