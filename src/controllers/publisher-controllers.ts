import { NextFunction, Request, Response } from 'express'
import { PublisherService } from '../services/publisher-service'

export class PublisherController {
  constructor(private publisherService: PublisherService) {}

  async createPublisher(req: Request, res: Response, next: NextFunction) {
    try {
      const newPublisher = await this.publisherService.createPublisher(req.body)
      return res.status(201).json(newPublisher)
    } catch (error) {
      return next(error)
    }
  }

  async getPublishers(req: Request, res: Response, next: NextFunction) {
    try {
      const publishers = await this.publisherService.getPublishers()
      return res.status(200).json(publishers)
    } catch (error) {
      return next(error)
    }
  }

  async getPublisherById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const publisher = await this.publisherService.getPublisherById(id as string)
      return res.status(200).json(publisher)
    } catch (error) {
      return next(error)
    }
  }

  async updatePublisher(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      const updatedPublisher = await this.publisherService.updatePublisher(
        id as string,
        req.body,
      )

      return res.status(200).json(updatedPublisher)
    } catch (error) {
      return next(error)
    }
  }

  async deletePublisher(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params
      await this.publisherService.deletePublisher(id as string)
      return res.status(204).send()
    } catch (error) {
      return next(error)
    }
  }
}
