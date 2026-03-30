import { AppError } from './app-error'

export class BookNotFoundError extends AppError {
  constructor(id: string) {
    super(`Book with id ${id} not found`, 404)
    this.name = 'BookNotFoundError'
  }
}
