import { NextFunction, Request, Response } from 'express'

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { title, year } = req.body

  if (!title || !year) {
    return res.status(400).json({ message: 'Title and year are required' })
  }

  if (typeof title !== 'string' || typeof year !== 'number') {
    return res
      .status(400)
      .json({ message: 'Title must be a string and year must be a number' })
  }

  next()
}
