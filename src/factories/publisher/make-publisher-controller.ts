import { PublisherController } from '../../controllers/publisher-controllers'
import { prisma } from '../../lib/prisma'
import { PublisherRepository } from '../../repositories/publisher-repository'
import { PublisherService } from '../../services/publisher-service'

export function makePublisherController() {
  const publisherRepository = new PublisherRepository(prisma)
  const publisherService = new PublisherService(publisherRepository)

  return new PublisherController(publisherService)
}
