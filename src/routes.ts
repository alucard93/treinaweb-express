import express, { Request, Response } from 'express'
import { makeBookController } from './factories/make-book-controller'

const router = express.Router()

const bookController = makeBookController()

router.post('/book', (req: Request, res: Response) => {
  bookController.createBook(req, res)
})

export default router
