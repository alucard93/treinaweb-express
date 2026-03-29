# Contrato do GET /books

Este documento mostra o contrato atual do endpoint de listagem de `books`.

Se a duvida for sobre arquitetura, injecao de dependencia ou factory, consulte [pegar-books.md](./pegar-books.md).

## 1. Endpoint

O endpoint de listagem e:

```txt
GET /books
```

## 2. Body da requisicao

Neste endpoint, nao existe body obrigatorio.

A listagem atual busca todos os registros de `Book` sem filtros.

## 3. Dados retornados

Os objetos retornados seguem o model `Book` em [../../prisma/schema.prisma](../../prisma/schema.prisma).

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

## 4. Exemplo de requisicao

Cabecalho:

```http
GET /books
```

## 5. Exemplo de resposta

Se a listagem der certo, a API retorna `200` com um array:

```json
[
  {
    "id": "8a5c3d3d-5d52-4f87-a8ef-4c8cb4cf0d7a",
    "title": "Clean Code",
    "isbn": "9780132350884",
    "publishedAt": 2008,
    "createdAt": "2026-03-29T21:13:53.207Z",
    "updatedAt": "2026-03-29T21:13:53.207Z",
  },
  {
    "id": "0ac4d3a1-3d4c-4d79-a8c7-a4109f31e7f2",
    "title": "Refactoring",
    "isbn": "9780201485677",
    "publishedAt": 1999,
    "createdAt": "2026-03-29T21:18:12.100Z",
    "updatedAt": "2026-03-29T21:18:12.100Z",
  }
]
```

## 6. Observacao

Se a listagem passar a aceitar filtros, paginacao ou ordenacao, esta documentacao precisa ser atualizada.
