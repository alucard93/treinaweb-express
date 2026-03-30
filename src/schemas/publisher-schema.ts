import { z } from 'zod'

export const createPublisherRequestSchema = z.object({
  body: z.object({
    name: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? 'name é obrigatório'
            : 'name deve ser uma string',
      })
      .trim()
      .min(1, 'name é obrigatório'),
  }),
})

export const updatePublisherRequestSchema = z.object({
  params: z.object({
    id: z.uuid('id invalido'),
  }),
  body: z
    .object({
      name: z.string().trim().min(1).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: 'envie ao menos um campo para atualizar',
    }),
})

export const publisherIdRequestSchema = z.object({
  params: z.object({
    id: z.string().uuid('id invalido'),
  }),
})

export type CreatePublisherBody = z.infer<
  typeof createPublisherRequestSchema
>['body']
export type UpdatePublisherBody = z.infer<
  typeof updatePublisherRequestSchema
>['body']
