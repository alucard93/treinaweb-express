import { Prisma, PrismaClient } from '../../generated/prisma'

export class AuthorRepository {
  constructor(private prisma: PrismaClient) {}

  async createAuthor(author: Prisma.AuthorCreateInput) {
    return await this.prisma.author.create({
      data: author,
      include: { books: true },
    })
  }

  async getAuthors() {
    return await this.prisma.author.findMany({
      include: {
        books: {
          include: {
            book: {
              select: {
                title: true,
                isbn: true,
                id: true,
              },
            },
          },
        },
      },
    })
  }

  async getAuthorById(id: string) {
    return await this.prisma.author.findUnique({
      where: { id },
    })
  }

  async updateAuthor(id: string, author: Prisma.AuthorUpdateInput) {
    try {
      return await this.prisma.author.update({
        where: { id },
        data: author,
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

  async deleteAuthor(id: string) {
    try {
      return await this.prisma.author.delete({
        where: { id },
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
}
