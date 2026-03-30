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
    return await this.prisma.book.update({
      where: { id },
      data: book,
    })
  }

  async deleteBook(id: string) {
    return await this.prisma.book.delete({
      where: { id },
    })
  }
}
