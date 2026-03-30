// src/middlewares/validate.ts
import { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'

type RequestSchemaShape = {
  body?: unknown
  params?: unknown
  query?: unknown
}

export function validate<T extends z.ZodType<RequestSchemaShape>>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      })

      req.body = parsed.body ?? req.body

      if (parsed.params) {
        req.params = parsed.params as typeof req.params
      }

      res.locals.validated = parsed

      next()
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          issues: error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        })
      }

      return next(error)
    }
  }
}
