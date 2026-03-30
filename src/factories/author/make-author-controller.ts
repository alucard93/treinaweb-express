import { prisma } from '../../lib/prisma'
import { AuthorRepository } from '../../repositories/author-repository'
import { AuthorService } from '../../services/author-service'
import { AuthorController } from '../../controllers/author-controllers'

export function makeAuthorController() {
  const authorRepository = new AuthorRepository(prisma)
  const authorService = new AuthorService(authorRepository)
  return new AuthorController(authorService)
}
