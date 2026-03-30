import { AppError } from './app-error'

export class AuthorNotFoundError extends AppError {
  constructor(id: string) {
    super(`Author with id ${id} not found`, 404)
    this.name = 'AuthorNotFoundError'
  }
}
