# Setup: Node.js + Express + TypeScript

Este documento registra o setup usado neste repositorio.

Para recriar a aplicacao completa no estado atual do projeto, veja tambem:

- [recriar-aplicacao-completa.md](./recriar-aplicacao-completa.md)

## 1. Inicializacao do projeto

Crie a pasta do projeto, abra o terminal e inicialize o `package.json` com as configuracoes padrao:

```bash
npm init -y
```

## 2. Instalacao de dependencias

Instale o Express como dependencia principal:

```bash
npm i express
```

Depois, instale as dependencias de desenvolvimento usadas no projeto:

```bash
npm i -D typescript @types/node @types/express ts-node-dev tsx
```

Observacoes:

- `typescript` faz a compilacao do codigo TypeScript
- `@types/node` adiciona as tipagens do Node.js
- `@types/express` adiciona as tipagens do Express
- `tsx` executa arquivos TypeScript diretamente no desenvolvimento
- `ts-node-dev` reinicia o servidor automaticamente ao salvar os arquivos

## 3. Configuracao do TypeScript

Gere o arquivo `tsconfig.json`:

```bash
npx tsc --init
```

Depois, substitua o conteudo gerado por esta configuracao:

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
  }
}
```

Essa configuracao deixa o projeto com:

- codigo-fonte em `src`
- arquivos compilados em `dist`
- tipagem estrita
- suporte a interoperabilidade com modulos comuns do ecossistema Node

## 4. Configuracao dos scripts

No `package.json`, a secao `scripts` ficou assim neste repositorio:

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

Pontos importantes:

- o `start` aponta para `dist/app.js`, que e o arquivo gerado a partir de `src/app.ts`
- o `dev` usa `tsx` para subir a aplicacao de forma simples
- o `watch` usa `ts-node-dev` com reinicio automatico
- o `prestart` garante que a compilacao rode antes do `npm start`

## 5. Criacao do servidor com Express

Crie a pasta `src` e, dentro dela, o arquivo `app.ts`.

O codigo atual do projeto esta assim:

```ts
import express from 'express'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
```

Esse arquivo faz o seguinte:

- cria a aplicacao Express
- habilita leitura de JSON nas requisicoes
- cria uma rota `GET /`
- sobe o servidor na porta definida em `PORT` ou na porta `3000`

## 6. Como rodar o projeto

Para desenvolvimento:

```bash
npm run dev
```

Para desenvolvimento com reinicio automatico:

```bash
npm run watch
```

Para gerar o build:

```bash
npm run build
```

Para rodar em modo de producao:

```bash
npm start
```

Depois disso, a aplicacao fica disponivel em:

```txt
http://localhost:3000
```

## 7. Estrutura final esperada

Ao final do setup, a estrutura principal do projeto fica assim:

```txt
src/
  app.ts
docs/
  setup.md
dist/
node_modules/
.gitignore
package.json
package-lock.json
tsconfig.json
README.md
```

## 8. Resumo do fluxo

O fluxo do setup foi este:

1. inicializar o projeto com `npm init -y`
2. instalar `express`
3. instalar TypeScript, tipagens e ferramentas de desenvolvimento
4. gerar e ajustar o `tsconfig.json`
5. criar `src/app.ts`
6. configurar os scripts no `package.json`
7. rodar o servidor com `npm run dev` ou `npm start`
