import { AppError } from './app-error'

export class PublisherNotFoundError extends AppError {
  constructor(id: string) {
    super(`Publisher with id ${id} not found`, 404)
    this.name = 'PublisherNotFoundError'
  }
}
