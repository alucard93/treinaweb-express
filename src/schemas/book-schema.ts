import { z } from 'zod'

export const createBookRequestSchema = z.object({
  body: z.object({
    title: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? 'title é obrigatório'
            : 'title deve ser uma string',
      })
      .trim()
      .min(1, 'title não pode ser vazio'),
    isbn: z.string().trim().optional(),
    publishedAt: z.coerce.number().int().positive().optional(),
    publisherId: z
      .uuid('publisherId invalido')
      .trim()
      .min(1, 'publisherId é obrigatório'),
  }),
})

export const updateBookRequestSchema = z.object({
  params: z.object({
    id: z.uuid('id invalido'),
  }),
  body: z
    .object({
      title: z.string().trim().min(1).optional(),
      isbn: z.string().trim().optional(),
      publishedAt: z.coerce.number().int().positive().optional(),
      publisherId: z.uuid('publisherId invalido').optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'envie ao menos um campo para atualizar',
    }),
})

export const bookIdRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid('id invalido'),
  }),
})

export type CreateBookBody = z.infer<typeof createBookRequestSchema>['body']
export type UpdateBookBody = z.infer<typeof updateBookRequestSchema>['body']
