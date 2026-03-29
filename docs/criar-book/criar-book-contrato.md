# Contrato do POST /book

Este documento mostra o contrato atual do endpoint de criacao de `book`.

Se a duvida for sobre arquitetura, injecao de dependencia ou factory, consulte [criar-book.md](./criar-book.md).

## 1. Endpoint

O endpoint de criacao e:

```txt
POST /book
```

## 2. Model usado na criacao

Os dados enviados precisam respeitar o model `Book` em [../prisma/schema.prisma](../prisma/schema.prisma).

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

No estado atual:

- `title` e obrigatorio
- `teste` e obrigatorio
- `isbn` e opcional
- `publishedAt` e opcional
- `id`, `createdAt` e `updatedAt` sao gerados automaticamente

## 3. Exemplo de requisicao

Cabecalho:

```http
POST /book
Content-Type: application/json
```

Body:

```json
{
  "title": "Clean Code",
  "teste": "valor de exemplo",
  "isbn": "9780132350884",
  "publishedAt": 2008
}
```

## 4. Exemplo de resposta

Se a criacao der certo, a API retorna `201` com o registro criado:

```json
{
  "id": "8a5c3d3d-5d52-4f87-a8ef-4c8cb4cf0d7a",
  "title": "Clean Code",
  "isbn": "9780132350884",
  "publishedAt": 2008,
  "createdAt": "2026-03-29T21:13:53.207Z",
  "updatedAt": "2026-03-29T21:13:53.207Z",
  "teste": "valor de exemplo"
}
```

## 5. Observacao

Se o schema do `Book` mudar, esta documentacao precisa ser atualizada junto com o endpoint.
