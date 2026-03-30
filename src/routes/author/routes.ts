import express, { NextFunction, Request, Response } from 'express'
import { makeAuthorController } from '../../factories/author/make-author-controller'
import {
  authorIdRequestSchema,
  createAuthorRequestSchema,
  updateAuthorRequestSchema,
} from '../../schemas/author-schema'
import { validate } from '../../middlewares/validate'

const router = express.Router()
const authorController = makeAuthorController()

router.post(
  '/author',
  validate(createAuthorRequestSchema),
  (req: Request, res: Response, next: NextFunction) => {
    return authorController.createAuthor(req, res, next)
  },
)

router.get('/authors', (req: Request, res: Response, next: NextFunction) => {
  return authorController.getAuthors(req, res, next)
})

router.get(
  '/author/:id',
  validate(authorIdRequestSchema),
  (req: Request, res: Response, next: NextFunction) => {
    return authorController.getAuthorById(req, res, next)
  },
)

router.patch(
  '/author/:id',
  validate(updateAuthorRequestSchema),
  (req: Request, res: Response, next: NextFunction) => {
    return authorController.updateAuthor(req, res, next)
  },
)

router.delete(
  '/author/:id',
  validate(authorIdRequestSchema),
  (req: Request, res: Response, next: NextFunction) => {
    return authorController.deleteAuthor(req, res, next)
  },
)

export default router