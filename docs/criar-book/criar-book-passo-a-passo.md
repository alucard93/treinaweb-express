# Passo a passo para criar a rota de book

Este documento mostra a ordem recomendada pelo time para criar a feature de `book`.

O foco aqui nao e explicar arquitetura em detalhe nem o contrato da API. O objetivo e mostrar o que criar primeiro, o que vem depois e em que arquivo cada parte entra.

Se precisar de contexto complementar:

- arquitetura da feature: [criar-book.md](./criar-book.md)
- contrato do endpoint: [criar-book-contrato.md](./criar-book-contrato.md)
- setup do Prisma: [../prisma/setup-prisma.md](../prisma/setup-prisma.md)
- criacao de rotas no projeto: [criar-rota.md](./criar-rota.md)

## 1. Ordem recomendada

Para criar a rota de `book`, a sequencia recomendada e esta:

1. definir ou atualizar o model `Book` no Prisma
2. aplicar a mudanca no banco
3. criar o `repository`
4. criar o `service`
5. criar o `controller`
6. criar a `factory`
7. registrar a rota
8. testar o endpoint

Essa ordem ajuda porque cada camada passa a depender de algo que ja existe.

## 2. Criar o model no Prisma

O primeiro passo e definir o `Book` em [../prisma/schema.prisma](../prisma/schema.prisma).

Exemplo:

```prisma
model Book {
  id          String   @id @default(uuid())
  title       String
  isbn        String?  @unique
  publishedAt Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

Esse passo vem primeiro porque o resto da feature depende da estrutura do dado que vai existir no banco.

## 3. Aplicar a mudanca no banco

Depois de ajustar o schema, aplique a mudanca no banco:

```bash
npx prisma migrate dev --name create-book
```

Se o objetivo for apenas sincronizar sem criar migration:

```bash
npx prisma db push
```

Na pratica do time, para desenvolvimento com historico de migration, o padrao e `migrate dev`.

## 4. Criar o repository

Com o model ja definido, crie a camada de persistencia em [../src/repositories/book-repository.ts](../src/repositories/book-repository.ts).

```ts
import { Prisma, PrismaClient } from '../../generated/prisma/client'

export class BookRepository {
  constructor(private prisma: PrismaClient) {}

  async createBook(book: Prisma.BookCreateInput) {
    return await this.prisma.book.create({
      data: book,
    })
  }
}
```

O repository vem antes do service porque o service vai depender dele.

## 5. Criar o service

Depois, crie a camada de regra de negocio em [../src/services/book-service.ts](../src/services/book-service.ts).

```ts
import { Prisma } from '../../generated/prisma/client'
import { BookRepository } from '../repositories/book-repository'

export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async createBook(book: Prisma.BookCreateInput) {
    return await this.bookRepository.createBook(book)
  }
}
```

Mesmo que no comeco ele apenas repasse os dados, essa continua sendo a camada certa para regras futuras.

## 6. Criar o controller

Depois do service, crie o controller em [../src/controllers/book-controllers.ts](../src/controllers/book-controllers.ts).

```ts
import { Request, Response } from 'express'
import { BookService } from '../services/book-service'

export class BookController {
  constructor(private bookService: BookService) {}

  async createBook(req: Request, res: Response) {
    try {
      const bookData = req.body
      const newBook = await this.bookService.createBook(bookData)
      return res.status(201).json(newBook)
    } catch (error) {
      console.error('Failed to create book', error)
      return res.status(500).json({ error: 'Failed to create book' })
    }
  }
}
```

O controller vem depois porque ele depende do service para executar a acao.

## 7. Criar a factory

Com repository, service e controller prontos, crie a composicao da feature em [../../src/factories/book/make-book-controller.ts](../../src/factories/book/make-book-controller.ts).

```ts
import { BookController } from '../../controllers/book-controllers'
import { prisma } from '../../lib/prisma'
import { BookRepository } from '../../repositories/book-repository'
import { BookService } from '../../services/book-service'

export function makeBookController() {
  const bookRepository = new BookRepository(prisma)
  const bookService = new BookService(bookRepository)

  return new BookController(bookService)
}
```

Esse passo centraliza a montagem das dependencias e evita deixar essa responsabilidade em `routes.ts`.

## 8. Registrar a rota

Depois da factory pronta, registre o endpoint em [../src/routes.ts](../src/routes.ts).

```ts
import express, { Request, Response } from 'express'
import { makeBookController } from './factories/book/make-book-controller'

const router = express.Router()

const bookController = makeBookController()

router.post('/book', (req: Request, res: Response) => {
  bookController.createBook(req, res)
})

export default router
```

Esse passo fica por ultimo porque a rota depende de toda a cadeia ja montada.

## 9. Testar o endpoint

Com tudo criado, teste a requisicao:

```http
POST /book
Content-Type: application/json
```

Body de exemplo:

```json
{
  "title": "Clean Code",
  "isbn": "9780132350884",
  "publishedAt": 2008
}
```

Se estiver tudo certo, a API deve responder com `201`.

## 10. Resumo rapido

Se alguem do time quiser lembrar a ordem sem reler tudo, o resumo e:

1. schema
2. migration
3. repository
4. service
5. controller
6. factory
7. route
8. teste
