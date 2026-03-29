import { Prisma, PrismaClient } from '../../generated/prisma/client'

export class BookRepository {
  constructor(private prisma: PrismaClient) {}

  async createBook(book: Prisma.BookCreateInput) {
    return await this.prisma.book.create({
      data: book,
    })
  }
}
