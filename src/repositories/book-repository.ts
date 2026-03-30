import { Prisma, PrismaClient } from '../../generated/prisma/client'

export class BookRepository {
  constructor(private prisma: PrismaClient) {}

  async createBook(book: Prisma.BookCreateInput) {
    return await this.prisma.book.create({
      data: book,
    })
  }

  async getBooks() {
    return await this.prisma.book.findMany()
  }

  async getBookById(id: string) {
    return await this.prisma.book.findUnique({
      where: { id },
    })
  }

  async updateBook(id: string, book: Prisma.BookUpdateInput) {
    try {
      return await this.prisma.book.update({
        where: { id },
        data: book,
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

  async deleteBook(id: string) {
    try {
      await this.prisma.book.delete({
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
