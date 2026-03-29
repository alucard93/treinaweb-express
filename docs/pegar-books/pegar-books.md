# Como funciona a listagem de books

Este documento explica o padrao arquitetural usado pelo time na feature de listagem de `books`.

O objetivo aqui e mostrar:

- o fluxo da requisicao
- a separacao em camadas
- onde entra a injecao de dependencia
- por que a mesma factory do modulo de `book` continua sendo usada

Se a duvida for sobre contrato do endpoint, consulte [pegar-books-contrato.md](./pegar-books-contrato.md).

Se a duvida for sobre a ordem recomendada de implementacao da feature, consulte [pegar-books-passo-a-passo.md](./pegar-books-passo-a-passo.md).

## 1. Fluxo da requisicao

O fluxo da requisicao e este:

1. `route`
2. `controller`
3. `service`
4. `repository`
5. `prisma`

Na pratica:

- a rota recebe o `GET /books`
- o controller lida com `req` e `res`
- o service centraliza a regra da feature
- o repository faz a consulta no banco
- o Prisma executa o `findMany`

## 2. Tipo de arquitetura

Nesta feature, o projeto continua usando arquitetura em camadas.

Cada camada tem uma responsabilidade clara:

- `route`: expor o endpoint
- `controller`: tratar HTTP
- `service`: tratar regra de negocio
- `repository`: acessar banco
- `prisma`: comunicar com o datasource

Isso evita misturar consulta ao banco com preocupacoes de HTTP no mesmo arquivo.

## 3. Injecao de dependencia

O projeto usa injecao de dependencia por construtor.

Exemplo no controller:

```ts
export class BookController {
  constructor(private bookService: BookService) {}
}
```

Exemplo no service:

```ts
export class BookService {
  constructor(private bookRepository: BookRepository) {}
}
```

Esse padrao ajuda o time porque:

- reduz acoplamento
- facilita testes
- deixa a composicao previsivel
- reaproveita a mesma estrutura do modulo de `book`

## 4. Por que a mesma factory e usada

Na listagem de `books`, nao foi criada outra factory porque a composicao da feature continua a mesma.

As dependencias ainda sao:

- `BookController`
- `BookService`
- `BookRepository`
- `prisma`

Como a listagem usa o mesmo controller, o mesmo service e o mesmo repository, a mesma factory do modulo continua suficiente.

A factory fica em [../../src/factories/book/make-book-controller.ts](../../src/factories/book/make-book-controller.ts).

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

## 5. Route

A rota fica em [../../src/routes.ts](../../src/routes.ts).

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

Aqui a rota faz so duas coisas:

- registra `GET /books`
- chama o controller

## 6. Controller

O controller fica em [../../src/controllers/book-controllers.ts](../../src/controllers/book-controllers.ts).

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

No time, o controller deve cuidar de preocupacoes HTTP:

- receber a requisicao
- devolver a resposta
- definir status code
- delegar a acao para o service

## 7. Service

O service fica em [../../src/services/book-service.ts](../../src/services/book-service.ts).

```ts
import { BookRepository } from '../repositories/book-repository'

export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async getBooks() {
    return await this.bookRepository.getBooks()
  }
}
```

Hoje ele apenas encaminha a listagem, mas esta continua sendo a camada correta para regras futuras como filtros, ordenacao ou paginacao.

## 8. Repository

O repository fica em [../../src/repositories/book-repository.ts](../../src/repositories/book-repository.ts).

```ts
import { PrismaClient } from '../../generated/prisma/client'

export class BookRepository {
  constructor(private prisma: PrismaClient) {}

  async getBooks() {
    return await this.prisma.book.findMany()
  }
}
```

Para o time, a regra aqui e:

- repository acessa banco
- repository nao trata HTTP
- repository nao define regra de negocio

## 9. Resumo para o time

Quando formos criar listagens parecidas, a ideia e manter este padrao:

1. rota simples
2. controller tratando HTTP
3. service tratando regra de negocio
4. repository tratando consulta
5. factory reaproveitada quando a composicao for a mesma

Esse e o padrao atual da listagem de `books`.
