import { z } from 'zod'

const authorBookConnectSchema = z.object({
  book: z.object({
    connect: z.object({
      id: z.uuid('book id invalido'),
    }),
  }),
})

export const createAuthorRequestSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'name é obrigatório'),
    bio: z.string().trim().optional(),
    books: z
      .object({
        create: z.array(authorBookConnectSchema).min(1),
      })
      .optional(),
  }),
})

export const updateAuthorRequestSchema = z.object({
  params: z.object({
    id: z.uuid('id invalido'),
  }),
  body: z
    .object({
      name: z.string().trim().min(1, 'name é obrigatório').optional(),
      bio: z.string().trim().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'envie ao menos um campo para atualizar',
    }),
})

export const authorIdRequestSchema = z.object({
  params: z.object({
    id: z.uuid('id invalido'),
  }),
})

export type CreateAuthorBody = z.infer<typeof createAuthorRequestSchema>['body']
export type UpdateAuthorBody = z.infer<typeof updateAuthorRequestSchema>['body']
