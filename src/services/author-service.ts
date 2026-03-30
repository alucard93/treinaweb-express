import { AuthorRepository } from '../repositories/author-repository'
import { AuthorNotFoundError } from '../errors/author-not-found'
import { CreateAuthorBody, UpdateAuthorBody } from '../schemas/author-schema'

export class AuthorService {
  constructor(private authorRepository: AuthorRepository) {}

  async createAuthor(author: CreateAuthorBody) {
    const data: {
      name: string
      bio?: string
      books?: {
        create: Array<{
          book: {
            connect: {
              id: string
            }
          }
        }>
      }
    } = {
      name: author.name,
    }

    if (author.bio !== undefined) data.bio = author.bio
    if (author.books !== undefined) data.books = author.books

    return await this.authorRepository.createAuthor(data)
  }

  async getAuthors() {
    return await this.authorRepository.getAuthors()
  }

  async getAuthorById(id: string) {
    const author = await this.authorRepository.getAuthorById(id)
    if (!author) {
      throw new AuthorNotFoundError(id)
    }
    return author
  }

  async updateAuthor(id: string, author: UpdateAuthorBody) {
    const data: {
      name?: string
      bio?: string
    } = {}

    if (author.name !== undefined) data.name = author.name

    if (author.bio !== undefined) data.bio = author.bio

    const updatedAuthor = await this.authorRepository.updateAuthor(id, data)

    if (!updatedAuthor) {
      throw new AuthorNotFoundError(id)
    }
    return updatedAuthor
  }

  async deleteAuthor(id: string) {
    const deletedAuthor = await this.authorRepository.deleteAuthor(id)
    if (!deletedAuthor) {
      throw new AuthorNotFoundError(id)
    }
  }
}
