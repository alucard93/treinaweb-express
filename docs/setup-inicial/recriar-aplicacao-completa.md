# Guia completo para recriar esta aplicacao

Este documento descreve como recriar a aplicacao atual do repositorio do zero.

O objetivo aqui nao e apenas subir um `Express` simples. O objetivo e chegar em uma API com:

- `Node.js`
- `Express`
- `TypeScript`
- `Prisma`
- `MySQL` ou `MariaDB`
- validacao com `Zod`
- arquitetura em camadas com `repository`, `service`, `controller` e `factory`
- tratamento padronizado de erros
- rotas para `publisher`, `book` e `author`

Se voce quiser apenas o setup inicial minimo, veja tambem:

- [setup.md](./setup.md)

Se quiser o passo a passo de criacao de novas features, veja tambem:

- [../criar-feature-passo-a-passo.md](../criar-feature-passo-a-passo.md)

## 1. Resultado final esperado

Ao final do processo, a aplicacao deve ter:

- conexao com banco via Prisma
- models `Publisher`, `Book`, `Author` e `BookAuthor`
- rotas REST para criacao, listagem, busca por id, update e delete
- validacao de `body` e `params` com `Zod`
- middleware global para erros

Rotas finais do projeto:

- `POST /publisher`
- `GET /publishers`
- `GET /publisher/:id`
- `PATCH /publisher/:id`
- `DELETE /publisher/:id`
- `POST /book`
- `GET /books`
- `GET /book/:id`
- `PATCH /book/:id`
- `DELETE /book/:id`
- `POST /author`
- `GET /authors`
- `GET /author/:id`
- `PATCH /author/:id`
- `DELETE /author/:id`

## 2. Pre requisitos

Antes de comecar, tenha instalado:

- `Node.js`
- `npm`
- `MySQL` ou `MariaDB`

Tambem e importante ter um banco disponivel localmente, porque o projeto depende de migration e de conexao real com o banco.

## 3. Criacao do projeto

Crie a pasta do projeto e inicialize o `package.json`:

```bash
npm init -y
```

## 4. Instalacao de dependencias

### 4.1 Dependencias de runtime

Instale:

```bash
npm i express dotenv zod @prisma/client @prisma/adapter-mariadb
```

Essas dependencias sao usadas assim:

- `express`: servidor HTTP
- `dotenv`: leitura das variaveis de ambiente
- `zod`: validacao de entrada
- `@prisma/client`: client gerado pelo Prisma
- `@prisma/adapter-mariadb`: adapter usado na conexao com MySQL ou MariaDB

### 4.2 Dependencias de desenvolvimento

Instale:

```bash
npm i -D typescript @types/node @types/express prisma tsx ts-node-dev
```

Essas dependencias cobrem:

- compilacao TypeScript
- tipagens para Node.js e Express
- CLI do Prisma
- execucao do projeto em desenvolvimento

## 5. Scripts do package.json

No projeto atual, a secao `scripts` fica assim:

```json
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "build": "tsc",
  "start": "node dist/app.js",
  "dev": "tsx src/app.ts",
  "watch": "ts-node-dev --respawn --transpile-only src/app.ts",
  "prestart": "npm run build"
}
```

Descricao rapida:

- `npm run dev`: sobe a API com `tsx`
- `npm run watch`: sobe a API com reload automatico
- `npm run build`: gera `dist`
- `npm start`: builda e roda a aplicacao compilada

## 6. Configuracao do TypeScript

Gere o `tsconfig.json`:

```bash
npx tsc --init
```

Depois ajuste para esta configuracao:

```json
{
  "compilerOptions": {
    "rootDir": "./src",
    "outDir": "./dist",
    "module": "nodenext",
    "target": "esnext",
    "types": ["node"],
    "sourceMap": true,
    "declaration": true,
    "declarationMap": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "esModuleInterop": true,
    "strict": true,
    "jsx": "react-jsx",
    "verbatimModuleSyntax": false,
    "isolatedModules": true,
    "noUncheckedSideEffectImports": true,
    "moduleDetection": "force",
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["dist", "node_modules"]
}
```

Essa configuracao deixa o projeto com:

- codigo fonte em `src`
- build em `dist`
- tipagem estrita
- suporte adequado para o ambiente Node atual

## 7. Variaveis de ambiente

Crie um arquivo `.env` baseado em `.env.example`.

Conteudo esperado:

```env
DATABASE_URL=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=
DATABASE_HOST=
DATABASE_PORT=
```

Exemplo preenchido:

```env
DATABASE_URL="mysql://root:root@localhost:3306/books"
DATABASE_USER="root"
DATABASE_PASSWORD="root"
DATABASE_NAME="books"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
```

Observacoes:

- `DATABASE_URL` e usada pelo Prisma
- as variaveis separadas sao usadas pelo adapter em `src/lib/prisma.ts`
- o banco precisa existir antes da migration

Se precisar, crie o banco manualmente:

```sql
CREATE DATABASE books;
```

## 8. Setup do Prisma

### 8.1 Inicializacao

Inicialize o Prisma com datasource MySQL:

```bash
npx prisma init --datasource-provider mysql --output ../generated/prisma
```

Esse comando cria a base do Prisma e define a saida do client gerado em `generated/prisma`.

### 8.2 Configuracao do Prisma

O projeto usa um arquivo `prisma.config.ts` com esta estrutura:

```ts
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
})
```

### 8.3 Schema final da aplicacao

Se a intencao for recriar a aplicacao no estado atual do repositorio, o caminho mais simples e criar o schema final de uma vez.

Use este `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mysql"
}

model Book {
  id          String    @id @default(uuid())
  title       String
  isbn        String?   @unique
  publishedAt Int?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  publisher   Publisher @relation(fields: [publisherId], references: [id], onDelete: Cascade)
  publisherId String

  bookAuthors BookAuthor[]
}

model Publisher {
  id        String   @id @default(uuid())
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  books     Book[]
}

model Author {
  id        String       @id @default(uuid())
  name      String
  bio       String?
  createdAt DateTime     @default(now())
  books     BookAuthor[]
}

model BookAuthor {
  id       String @id @default(uuid())
  book     Book   @relation(fields: [bookId], references: [id])
  author   Author @relation(fields: [authorId], references: [id])
  authorId String
  bookId   String
}
```

### 8.4 Migration e generate

Depois do schema pronto:

```bash
npx prisma migrate dev --name init
```

Se quiser gerar o client novamente de forma explicita:

```bash
npx prisma generate
```

Observacao importante:

- o repositorio atual tem varias migrations porque a aplicacao evoluiu em etapas
- se o objetivo for apenas recriar o estado final do projeto, uma migration inicial com o schema final ja resolve

## 9. Estrutura de pastas

Depois do setup, a estrutura principal deve ficar proxima disso:

```txt
docs/
  criar-book/
  middleware/
  prisma/
  setup-inicial/
prisma/
  migrations/
  schema.prisma
src/
  controllers/
  errors/
  factories/
  lib/
  middlewares/
  repositories/
  routes/
  schemas/
  services/
  app.ts
generated/
  prisma/
.env
.env.example
package.json
prisma.config.ts
tsconfig.json
```

## 10. Infraestrutura base da aplicacao

Antes de criar as features de negocio, monte a infraestrutura base.

### 10.1 Client do Prisma

Crie `src/lib/prisma.ts`:

```ts
import 'dotenv/config'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { PrismaClient } from '../../generated/prisma'

const adapter = new PrismaMariaDb({
  host: process.env.DATABASE_HOST!,
  user: process.env.DATABASE_USER!,
  password: process.env.DATABASE_PASSWORD!,
  database: process.env.DATABASE_NAME!,
  port: Number(process.env.DATABASE_PORT!),
  connectionLimit: 5,
})

export const prisma = new PrismaClient({ adapter })
```

Esse arquivo centraliza a conexao reutilizada pelos repositories.

### 10.2 Erro base

Crie `src/errors/app-error.ts`:

```ts
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message)
    this.name = 'AppError'
  }
}
```

### 10.3 Middleware global de erro

Crie `src/middlewares/error-handler.ts`:

```ts
import { ErrorRequestHandler } from 'express'
import { AppError } from '../errors/app-error'

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
    })
  }

  console.error(error)

  return res.status(500).json({
    error: 'Internal server error',
  })
}
```

### 10.4 Middleware de validacao

Crie `src/middlewares/validate.ts`:

```ts
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
```

Esse middleware e a base para os schemas de `book`, `author` e `publisher`.

## 11. Ordem de criacao das features

A ordem recomendada no projeto e:

1. Prisma
2. migration
3. erro especifico
4. schema Zod
5. repository
6. service
7. controller
8. factory
9. routes
10. registro no `app`
11. teste

Essa ordem evita criar camadas que dependem de arquivos que ainda nao existem.

## 12. Feature de publisher

`publisher` e a melhor feature para montar primeiro porque `book` depende dela.

### 12.1 Erro

Crie `src/errors/publisher-not-found-error.ts`:

```ts
import { AppError } from './app-error'

export class PublisherNotFoundError extends AppError {
  constructor(id: string) {
    super(`Publisher with id ${id} not found`, 404)
    this.name = 'PublisherNotFoundError'
  }
}
```

### 12.2 Schema

Crie `src/schemas/publisher-schema.ts` com:

- `createPublisherRequestSchema`
- `updatePublisherRequestSchema`
- `publisherIdRequestSchema`
- `CreatePublisherBody`
- `UpdatePublisherBody`

Campos usados:

- `name` obrigatorio na criacao
- `id` UUID nas rotas por identificador

### 12.3 Repository

Crie `src/repositories/publisher-repository.ts`.

Operacoes atuais:

- `createPublisher`
- `getPublishers`
- `getPublisherById`
- `updatePublisher`
- `deletePublisher`

Detalhes importantes:

- `findMany` e `findUnique` incluem `books`
- `update` e `delete` tratam `P2025` retornando `null` ou `false`

### 12.4 Service

Crie `src/services/publisher-service.ts`.

Responsabilidades:

- montar os dados enviados ao repository
- lancar `PublisherNotFoundError` quando necessario

### 12.5 Controller

Crie `src/controllers/publisher-controllers.ts`.

Responsabilidades:

- receber requisicao
- chamar o service
- devolver `201`, `200` ou `204`
- encaminhar erros com `next(error)`

### 12.6 Factory

Crie `src/factories/publisher/make-publisher-controller.ts`.

Ela deve:

1. instanciar `PublisherRepository`
2. instanciar `PublisherService`
3. retornar `PublisherController`

### 12.7 Rotas

Crie `src/routes/publisher/routes.ts`.

Rotas finais:

- `POST /publisher`
- `GET /publishers`
- `GET /publisher/:id`
- `PATCH /publisher/:id`
- `DELETE /publisher/:id`

Todas as rotas com `id` usam `validate(...)` com schema apropriado.

### 12.8 Exemplo de body

Criacao:

```json
{
  "name": "Addison-Wesley"
}
```

## 13. Feature de book

`book` depende de `publisher`, porque o model possui `publisherId`.

### 13.1 Erro

Crie `src/errors/book-not-found-error.ts`.

Ela estende `AppError` e responde `404`.

### 13.2 Schema

Crie `src/schemas/book-schema.ts`.

Esse arquivo deve ter:

- `createBookRequestSchema`
- `updateBookRequestSchema`
- `bookIdRequestSchema`
- `CreateBookBody`
- `UpdateBookBody`

Campos usados atualmente:

- `title`: string obrigatoria
- `isbn`: string opcional
- `publishedAt`: numero inteiro positivo opcional
- `publisherId`: UUID obrigatorio na criacao

### 13.3 Repository

Crie `src/repositories/book-repository.ts`.

Operacoes atuais:

- `createBook`
- `getBooks`
- `getBookById`
- `updateBook`
- `deleteBook`

Detalhes importantes:

- `getBooks` inclui `publisher` e `bookAuthors`
- `update` e `delete` tratam `P2025`

### 13.4 Service

Crie `src/services/book-service.ts`.

Esse service faz algo importante:

- transforma o `publisherId` recebido no body em `publisher.connect`

Em vez de enviar `publisherId` direto ao Prisma, ele monta:

```ts
publisher: {
  connect: {
    id: book.publisherId,
  },
}
```

Tambem lanca `BookNotFoundError` em `getBookById`, `updateBook` e `deleteBook`.

### 13.5 Controller

Crie `src/controllers/book-controllers.ts`.

Metodos atuais:

- `createBook`
- `getBooks`
- `getBookById`
- `updateBook`
- `deleteBook`

### 13.6 Factory

Crie `src/factories/book/make-book-controller.ts`.

### 13.7 Rotas

Crie `src/routes/book/routes.ts`.

Rotas finais:

- `POST /book`
- `GET /books`
- `GET /book/:id`
- `PATCH /book/:id`
- `DELETE /book/:id`

### 13.8 Exemplo de body

Criacao:

```json
{
  "title": "Clean Code",
  "isbn": "9780132350884",
  "publishedAt": 2008,
  "publisherId": "UUID_DO_PUBLISHER"
}
```

Update:

```json
{
  "title": "Clean Code 2a edicao"
}
```

## 14. Feature de author

`author` fecha a parte relacional do projeto, porque usa a tabela intermediaria `BookAuthor`.

### 14.1 Erro

Crie `src/errors/author-not-found.ts`.

### 14.2 Schema

Crie `src/schemas/author-schema.ts`.

Esse arquivo deve expor:

- `createAuthorRequestSchema`
- `updateAuthorRequestSchema`
- `authorIdRequestSchema`
- `CreateAuthorBody`
- `UpdateAuthorBody`

Campos atuais:

- `name`: obrigatorio
- `bio`: opcional
- `books`: opcional na criacao

Quando `books` vier no body, ele segue este formato:

```json
{
  "books": {
    "create": [
      {
        "book": {
          "connect": {
            "id": "UUID_DO_BOOK"
          }
        }
      }
    ]
  }
}
```

### 14.3 Repository

Crie `src/repositories/author-repository.ts`.

Operacoes atuais:

- `createAuthor`
- `getAuthors`
- `getAuthorById`
- `updateAuthor`
- `deleteAuthor`

Detalhes importantes:

- `createAuthor` inclui `books`
- `getAuthors` inclui `books.book`
- `update` e `delete` tratam `P2025`

### 14.4 Service

Crie `src/services/author-service.ts`.

Responsabilidades:

- montar o payload opcional de `bio`
- repassar a criacao aninhada de `books`
- lancar `AuthorNotFoundError` quando necessario

### 14.5 Controller

Crie `src/controllers/author-controllers.ts`.

### 14.6 Factory

Crie `src/factories/author/make-author-controller.ts`.

### 14.7 Rotas

Crie `src/routes/author/routes.ts`.

Rotas finais:

- `POST /author`
- `GET /authors`
- `GET /author/:id`
- `PATCH /author/:id`
- `DELETE /author/:id`

### 14.8 Exemplo de body

Criacao simples:

```json
{
  "name": "Robert C. Martin",
  "bio": "Autor de Clean Code"
}
```

Criacao conectando livros:

```json
{
  "name": "Robert C. Martin",
  "bio": "Autor de Clean Code",
  "books": {
    "create": [
      {
        "book": {
          "connect": {
            "id": "UUID_DO_BOOK"
          }
        }
      }
    ]
  }
}
```

## 15. Montagem do app principal

Depois das features prontas, crie `src/app.ts`.

Conteudo final:

```ts
import express from 'express'
import { errorHandler } from './middlewares/error-handler'
import bookRouter from './routes/book/routes'
import publisherRouter from './routes/publisher/routes'
import authorRouter from './routes/author/routes'

const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use('/', bookRouter)
app.use('/', publisherRouter)
app.use('/', authorRouter)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
```

Fluxo do `app.ts`:

1. cria o servidor
2. habilita JSON
3. registra routers
4. cria rota raiz
5. registra o middleware global de erro
6. inicia o servidor

## 16. Ordem mais pratica para recriar tudo

Se eu estivesse recriando esta aplicacao do zero hoje, eu seguiria exatamente esta ordem:

1. criar o projeto com `npm init -y`
2. instalar dependencias
3. configurar `package.json`
4. configurar `tsconfig.json`
5. criar `.env.example` e `.env`
6. inicializar Prisma
7. escrever o schema final em `prisma/schema.prisma`
8. rodar `npx prisma migrate dev --name init`
9. criar `src/lib/prisma.ts`
10. criar `src/errors/app-error.ts`
11. criar `src/middlewares/error-handler.ts`
12. criar `src/middlewares/validate.ts`
13. implementar `publisher`
14. implementar `book`
15. implementar `author`
16. montar `src/app.ts`
17. rodar a API e testar

## 17. Comandos finais para subir o projeto

Desenvolvimento:

```bash
npm run dev
```

Modo watch:

```bash
npm run watch
```

Build:

```bash
npm run build
```

Producao:

```bash
npm start
```

Endereco padrao:

```txt
http://localhost:3000
```

## 18. Teste manual minimo

Uma ordem simples para validar o funcionamento:

1. criar um `publisher`
2. criar um `book` usando o `publisherId`
3. criar um `author` conectando o `book`
4. listar `publishers`
5. listar `books`
6. listar `authors`
7. buscar por id
8. testar update
9. testar delete

Sequencia de exemplo:

### 18.1 Criar publisher

```http
POST /publisher
Content-Type: application/json
```

```json
{
  "name": "Addison-Wesley"
}
```

### 18.2 Criar book

```http
POST /book
Content-Type: application/json
```

```json
{
  "title": "Clean Code",
  "isbn": "9780132350884",
  "publishedAt": 2008,
  "publisherId": "UUID_DO_PUBLISHER"
}
```

### 18.3 Criar author

```http
POST /author
Content-Type: application/json
```

```json
{
  "name": "Robert C. Martin",
  "bio": "Autor de Clean Code",
  "books": {
    "create": [
      {
        "book": {
          "connect": {
            "id": "UUID_DO_BOOK"
          }
        }
      }
    ]
  }
}
```

## 19. Arquivos de referencia no repositorio

Se voce quiser comparar a sua recriacao com a implementacao atual, use estes arquivos como referencia:

- `package.json`
- `tsconfig.json`
- `prisma.config.ts`
- `prisma/schema.prisma`
- `src/app.ts`
- `src/lib/prisma.ts`
- `src/middlewares/error-handler.ts`
- `src/middlewares/validate.ts`
- `src/errors/app-error.ts`
- `src/errors/publisher-not-found-error.ts`
- `src/errors/book-not-found-error.ts`
- `src/errors/author-not-found.ts`
- `src/schemas/publisher-schema.ts`
- `src/schemas/book-schema.ts`
- `src/schemas/author-schema.ts`
- `src/repositories/publisher-repository.ts`
- `src/repositories/book-repository.ts`
- `src/repositories/author-repository.ts`
- `src/services/publisher-service.ts`
- `src/services/book-service.ts`
- `src/services/author-service.ts`
- `src/controllers/publisher-controllers.ts`
- `src/controllers/book-controllers.ts`
- `src/controllers/author-controllers.ts`
- `src/factories/publisher/make-publisher-controller.ts`
- `src/factories/book/make-book-controller.ts`
- `src/factories/author/make-author-controller.ts`
- `src/routes/publisher/routes.ts`
- `src/routes/book/routes.ts`
- `src/routes/author/routes.ts`

## 20. Observacoes finais

Alguns detalhes da implementacao atual valem atencao:

- o projeto usa `Express 5`
- a conexao do Prisma usa `PrismaMariaDb`
- a validacao fica centralizada no middleware `validate`
- os services sao os responsaveis por transformar o payload da API para o formato do Prisma
- os repositories concentram o acesso ao banco
- as factories montam as dependencias e evitam essa responsabilidade nas rotas

Se a ideia for documentar ainda mais, um bom proximo passo e criar um guia separado com:

1. fluxo de criacao de cada entidade
2. exemplos de resposta de cada endpoint
3. erros esperados por rota
4. sequencia de testes com Insomnia ou Postman
