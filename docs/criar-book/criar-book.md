# Como funciona a criacao de book

Este documento explica o padrao arquitetural usado pelo time na feature de criacao de `book`.

O objetivo aqui e mostrar:

- o fluxo da requisicao
- a separacao em camadas
- onde entra a injecao de dependencia
- por que a composicao foi movida para uma factory

Se a duvida for sobre payload, campos aceitos ou exemplo de request/response do endpoint, consulte [criar-book-contrato.md](./criar-book-contrato.md).

Se a duvida for sobre a ordem recomendada de implementacao da feature, consulte [criar-book-passo-a-passo.md](./criar-book-passo-a-passo.md).

## 1. Fluxo da requisicao

O fluxo da requisicao e este:

1. `route`
2. `controller`
3. `service`
4. `repository`
5. `prisma`

Na pratica:

- a rota recebe o `POST /book`
- o controller lida com `req` e `res`
- o service centraliza a regra da feature
- o repository faz a persistencia
- o Prisma executa o insert no banco

## 2. Tipo de arquitetura

Neste modulo, o projeto usa arquitetura em camadas.

Cada camada tem uma responsabilidade clara:

- `route`: expor o endpoint
- `controller`: tratar HTTP
- `service`: tratar regra de negocio
- `repository`: acessar banco
- `prisma`: comunicar com o datasource

Isso evita misturar regra de negocio com detalhes de framework ou banco no mesmo arquivo.

## 3. Injecao de dependencia

O projeto usa injecao de dependencia por construtor.

Isso quer dizer que cada classe recebe no `constructor` aquilo de que precisa, em vez de instanciar tudo internamente.

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
- deixa a composicao mais previsivel
- centraliza a montagem das dependencias

## 4. Factory de composicao

A feature usa uma factory para montar `controller`, `service` e `repository`.

A factory fica em [../src/factories/make-book-controller.ts](../src/factories/make-book-controller.ts).

```ts
import { BookController } from '../controllers/book-controllers'
import { prisma } from '../lib/prisma'
import { BookRepository } from '../repositories/book-repository'
import { BookService } from '../services/book-service'

export function makeBookController() {
  const bookRepository = new BookRepository(prisma)
  const bookService = new BookService(bookRepository)

  return new BookController(bookService)
}
```

O papel da factory e apenas compor a feature.

Ela nao processa request e nao executa regra de negocio. Ela so monta as dependencias na ordem correta.

## 5. Route

A rota fica em [../src/routes.ts](../src/routes.ts).

```ts
import express, { Request, Response } from 'express'
import { makeBookController } from './factories/make-book-controller'

const router = express.Router()

const bookController = makeBookController()

router.post('/book', (req: Request, res: Response) => {
  bookController.createBook(req, res)
})

export default router
```

Aqui a rota faz so duas coisas:

- registra `POST /book`
- chama o controller

## 6. Controller

O controller fica em [../src/controllers/book-controllers.ts](../src/controllers/book-controllers.ts).

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

No time, o controller deve cuidar de preocupacoes HTTP:

- ler `req`
- devolver `res`
- definir status code
- delegar o trabalho para o service

## 7. Service

O service fica em [../src/services/book-service.ts](../src/services/book-service.ts).

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

Hoje ele so encaminha a criacao, mas esta e a camada correta para regra de negocio quando a feature crescer.

## 8. Repository

O repository fica em [../src/repositories/book-repository.ts](../src/repositories/book-repository.ts).

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

Para o time, a regra aqui e:

- repository acessa banco
- repository nao trata HTTP
- repository nao define regra de negocio

## 9. Resumo para o time

Quando formos criar features parecidas, a ideia e manter este padrao:

1. rota simples
2. controller tratando HTTP
3. service tratando regra de negocio
4. repository tratando persistencia
5. factory montando as dependencias

Esse e o padrao atual do modulo de `book`.
