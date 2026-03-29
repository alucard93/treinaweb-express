# treinaweb-prisma

Projeto base com Node.js, Express, TypeScript, Prisma ORM e MySQL.

## Setup

### INSTALE AS DEPENDÊNCIAS

- `npm install prisma @types/node --save-dev`
- `npm install @prisma/client @prisma/adapter-mariadb dotenv`

Essas dependências cobrem:

- `prisma`: CLI para inicializar, gerar client e criar migrations
- `@prisma/client`: client usado na aplicação
- `@prisma/adapter-mariadb`: adapter para conexão com MariaDB/MySQL
- `dotenv`: carregamento das variáveis de ambiente

### Initialize Prisma ORM

- `npx prisma`

Esse comando valida se a CLI do Prisma está instalada e disponível no projeto.

### CRIO O PRISMA SCHEMA

- `npx prisma init --datasource-provider mysql --output ../generated/prisma`

Esse passo cria a base da estrutura do Prisma:

- pasta `prisma/`
- arquivo `prisma/schema.prisma`
- configuração para geração do client em `generated/prisma`
- uso do arquivo `prisma.config.ts` para ler a `DATABASE_URL`

### AJUSTO O ENV PARA O BANCO

No arquivo `.env`, defina as variáveis de conexão:

```env
DATABASE_URL="mysql://root:root@localhost:3306/books"
DATABASE_USER="root"
DATABASE_PASSWORD="root"
DATABASE_NAME="books"
DATABASE_HOST="localhost"
DATABASE_PORT=3306
```

Observação:

- `DATABASE_URL` é a variável principal usada pelo Prisma
- as demais variáveis ajudam a padronizar a configuração do banco no projeto

### CONECTO NO SGBD

Antes de rodar a migration, o banco precisa existir e o servidor MySQL/MariaDB precisa estar ativo.

Checklist:

- iniciar o SGBD local
- garantir que o banco `books` exista
- validar usuário, senha, host e porta definidos no `.env`

Se necessário, crie o banco manualmente no seu gerenciador SQL:

```sql
CREATE DATABASE books;
```

### CRIO MEU SCHEMA

No arquivo `prisma/schema.prisma`, defina o generator, datasource e os models da aplicação:

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../generated/prisma"
}

datasource db {
  provider = "mysql"
}

model Book {
  id          String   @id @default(uuid())
  title       String
  isbn        String?  @unique
  publishedAt Int?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  author      String
}
```

Nesse schema:

- `Book` representa a tabela de livros
- `id` é gerado automaticamente com UUID
- `isbn` é opcional e único
- `createdAt` e `updatedAt` controlam auditoria básica do registro

### CRIO A PRIMEIRA MIGRATION

Depois de definir o model, execute:

```bash
npx prisma migrate dev --name init
```

Esse comando:

- cria a primeira migration em `prisma/migrations`
- aplica a migration no banco
- sincroniza a estrutura física com o schema

### IMPLEMENTO O CLIENT DO PRISMA NO PROJETO

Depois da migration, gere ou atualize o client:

```bash
npx prisma generate
```

Exemplo de implementação de um client reutilizável em `src/prisma.ts`:

```ts
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma'

export const prisma = new PrismaClient()
```

Exemplo de uso em um repositório ou serviço:

```ts
import { prisma } from './prisma'

export async function listBooks() {
  return prisma.book.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })
}
```

## Fluxo Resumido

1. Instalar as dependências
2. Inicializar o Prisma
3. Configurar o `.env`
4. Definir os models no `schema.prisma`
5. Criar e aplicar a migration
6. Gerar o Prisma Client
7. Usar o client na camada de repositório ou serviço
