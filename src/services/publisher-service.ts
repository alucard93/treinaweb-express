import { PublisherNotFoundError } from '../errors/publisher-not-found-error'
import { PublisherRepository } from '../repositories/publisher-repository'
import {
  CreatePublisherBody,
  UpdatePublisherBody,
} from '../schemas/publisher-schema'

export class PublisherService {
  constructor(private publisherRepository: PublisherRepository) {}

  async createPublisher(publisher: CreatePublisherBody) {
    return await this.publisherRepository.createPublisher({
      name: publisher.name,
    })
  }

  async getPublishers() {
    return await this.publisherRepository.getPublishers()
  }

  async getPublisherById(id: string) {
    const publisher = await this.publisherRepository.getPublisherById(id)

    if (!publisher) {
      throw new PublisherNotFoundError(id)
    }

    return publisher
  }

  async updatePublisher(id: string, publisher: UpdatePublisherBody) {
    const data: {
      name?: string
    } = {}

    if (publisher.name !== undefined) data.name = publisher.name

    const updatedPublisher = await this.publisherRepository.updatePublisher(
      id,
      data,
    )

    if (!updatedPublisher) {
      throw new PublisherNotFoundError(id)
    }

    return updatedPublisher
  }

  async deletePublisher(id: string) {
    const deleted = await this.publisherRepository.deletePublisher(id)

    if (!deleted) {
      throw new PublisherNotFoundError(id)
    }
  }
}
