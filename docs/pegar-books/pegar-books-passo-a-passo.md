# Passo a passo para criar a rota de pegar todos os books

Este documento mostra a ordem recomendada pelo time para implementar a listagem de `books`.

O foco aqui nao e explicar arquitetura em detalhe nem o contrato da API. O objetivo e mostrar o que criar primeiro, o que vem depois e em que arquivo cada parte entra.

Se precisar de contexto complementar:

- arquitetura da feature: [pegar-books.md](./pegar-books.md)
- contrato do endpoint: [pegar-books-contrato.md](./pegar-books-contrato.md)
- criacao de rotas no projeto: [../criar-book/criar-rota.md](../criar-book/criar-rota.md)

## 1. Ordem recomendada

Para criar a listagem de `books`, a sequencia recomendada e esta:

1. garantir que o model `Book` ja existe
2. criar o metodo no `repository`
3. criar o metodo no `service`
4. criar o metodo no `controller`
5. reaproveitar ou ajustar a `factory`
6. registrar a rota
7. testar o endpoint

Essa ordem ajuda porque cada camada passa a depender de algo que ja existe.

## 2. Garantir que o model existe

Antes da listagem, o `Book` precisa existir em [../../prisma/schema.prisma](../../prisma/schema.prisma).

Exemplo:

```prisma
model Book {
  id          String   @id @default(uuid())
  title       String
  isbn        String?  @unique
  publishedAt Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  teste       String
}
```

Como a listagem nao cria uma nova estrutura no banco, normalmente nao ha migration especifica aqui. Ela apenas consulta um model que ja existe.

## 3. Criar o metodo no repository

Primeiro, crie a consulta no repository em [../../src/repositories/book-repository.ts](../../src/repositories/book-repository.ts).

```ts
import { PrismaClient } from '../../generated/prisma/client'

export class BookRepository {
  constructor(private prisma: PrismaClient) {}

  async getBooks() {
    return await this.prisma.book.findMany()
  }
}
```

O repository vem antes porque o service depende dele.

## 4. Criar o metodo no service

Depois, exponha a operacao no service em [../../src/services/book-service.ts](../../src/services/book-service.ts).

```ts
import { BookRepository } from '../repositories/book-repository'

export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async getBooks() {
    return await this.bookRepository.getBooks()
  }
}
```

Mesmo simples, essa ainda e a camada correta para filtros, paginacao ou regras futuras.

## 5. Criar o metodo no controller

Depois do service, crie o metodo HTTP no controller em [../../src/controllers/book-controllers.ts](../../src/controllers/book-controllers.ts).

```ts
import { Request, Response } from 'express'
import { BookService } from '../services/book-service'

export class BookController {
  constructor(private bookService: BookService) {}

  async getBooks(req: Request, res: Response) {
    try {
      const books = await this.bookService.getBooks()
      return res.status(200).json(books)
    } catch (error) {
      console.error('Failed to get books', error)
      return res.status(500).json({ error: 'Failed to get books' })
    }
  }
}
```

O controller vem depois porque ele depende do service para executar a acao.

## 6. Reaproveitar a factory

Como a listagem usa a mesma composicao do modulo de `book`, nao e necessario criar outra factory.

O modulo continua usando [../../src/factories/book/make-book-controller.ts](../../src/factories/book/make-book-controller.ts):

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

Esse passo existe para reforcar que a listagem reaproveita a composicao ja existente.

## 7. Registrar a rota

Depois disso, registre o endpoint em [../../src/routes.ts](../../src/routes.ts).

```ts
import express, { Request, Response } from 'express'
import { makeBookController } from './factories/book/make-book-controller'

const router = express.Router()

const bookController = makeBookController()

router.get('/books', (req: Request, res: Response) => {
  bookController.getBooks(req, res)
})

export default router
```

Esse passo fica por ultimo porque a rota depende de toda a cadeia ja estar pronta.

## 8. Testar o endpoint

Com tudo criado, teste a requisicao:

```http
GET /books
```

Se estiver tudo certo, a API deve responder com `200` e um array de livros.

## 9. Resumo rapido

Se alguem do time quiser lembrar a ordem sem reler tudo, o resumo e:

1. model existente
2. repository
3. service
4. controller
5. factory reaproveitada
6. route
7. teste
