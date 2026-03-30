import { Prisma, PrismaClient } from '../../generated/prisma'

export class PublisherRepository {
  constructor(private prisma: PrismaClient) {}

  async createPublisher(publisher: Prisma.PublisherCreateInput) {
    return await this.prisma.publisher.create({
      data: publisher,
    })
  }

  async getPublishers() {
    return await this.prisma.publisher.findMany()
  }

  async getPublisherById(id: string) {
    return await this.prisma.publisher.findUnique({
      where: { id },
    })
  }

  async updatePublisher(id: string, publisher: Prisma.PublisherUpdateInput) {
    try {
      return await this.prisma.publisher.update({
        where: { id },
        data: publisher,
      })
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return null
      }

      throw error
    }
  }

  async deletePublisher(id: string) {
    try {
      await this.prisma.publisher.delete({
        where: { id },
      })

      return true
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return false
      }

      throw error
    }
  }
}
