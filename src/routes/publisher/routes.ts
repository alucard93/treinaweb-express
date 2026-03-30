import express, { NextFunction, Request, Response } from 'express'
import { makePublisherController } from '../../factories/publisher/make-publisher-controller'
import {
  createPublisherRequestSchema,
  publisherIdRequestSchema,
  updatePublisherRequestSchema,
} from '../../schemas/publisher-schema'
import { validate } from '../../middlewares/validate'

const router = express.Router()

const publisherController = makePublisherController()

router.post(
  '/publisher',
  validate(createPublisherRequestSchema),
  (req: Request, res: Response, next: NextFunction) => {
    return publisherController.createPublisher(req, res, next)
  },
)

router.get(
  '/publishers',
  (req: Request, res: Response, next: NextFunction) => {
    return publisherController.getPublishers(req, res, next)
  },
)

router.get(
  '/publisher/:id',
  validate(publisherIdRequestSchema),
  (req: Request, res: Response, next: NextFunction) => {
    return publisherController.getPublisherById(req, res, next)
  },
)

router.patch(
  '/publisher/:id',
  validate(updatePublisherRequestSchema),
  (req: Request, res: Response, next: NextFunction) => {
    return publisherController.updatePublisher(req, res, next)
  },
)

router.delete(
  '/publisher/:id',
  validate(publisherIdRequestSchema),
  (req: Request, res: Response, next: NextFunction) => {
    return publisherController.deletePublisher(req, res, next)
  },
)

export default router
