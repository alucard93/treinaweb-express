# Como criar uma nova rota

Este documento mostra o fluxo usado neste repositorio para adicionar uma nova rota no Express com TypeScript.

## 1. Onde as rotas ficam

As rotas da aplicacao ficam centralizadas em [../src/routes.ts](../src/routes.ts).

Esse arquivo:

- cria uma instancia de `express.Router()`
- registra os endpoints
- exporta o `router`

Depois, o router e conectado na aplicacao em [../src/app.ts](../src/app.ts).

## 2. Estrutura atual

Hoje o fluxo esta assim:

```ts
import express from 'express'

const router = express.Router()

router.get('/book', (req, res) => {
  res.status(200).json([])
})

export default router
```

E em `app.ts`:

```ts
app.use('/', router)
```

Isso significa que qualquer rota criada em `routes.ts` passa a ficar disponivel a partir da raiz da aplicacao.

## 3. Como adicionar uma rota nova

Para criar uma nova rota:

1. abra [../src/routes.ts](../src/routes.ts)
2. escolha o metodo HTTP correto: `get`, `post`, `patch`, `delete`
3. defina o caminho da rota
4. implemente o handler com `req` e `res`

Exemplo de rota simples:

```ts
router.get('/authors', (req, res) => {
  res.status(200).json([
    { id: 1, name: 'Machado de Assis' },
    { id: 2, name: 'Clarice Lispector' },
  ])
})
```

Com isso, a rota fica acessivel em:

```txt
GET /authors
```

## 4. Exemplo com parametros

Se voce precisar identificar um recurso pelo `id`, use parametros na URL:

```ts
router.get('/authors/:id', (req, res) => {
  const { id } = req.params

  res.status(200).json({ id: Number(id) })
})
```

Nesse caso:

```txt
GET /authors/1
```

O valor pode ser lido em `req.params.id`.

## 5. Exemplo com body

Para criar dados com `POST`, leia o corpo da requisicao em `req.body`.

O projeto ja usa:

```ts
app.use(express.json())
```

Por isso, JSON enviado pelo cliente ja chega parseado.

Exemplo:

```ts
router.post('/authors', (req, res) => {
  const { name } = req.body

  const author = {
    id: 1,
    name,
  }

  res.status(201).json(author)
})
```

## 6. Exemplo com query string

Para filtros simples, use `req.query`.

Exemplo:

```ts
router.get('/authors', (req, res) => {
  const country = req.query.country

  res.status(200).json({ country })
})
```

Requisicao:

```txt
GET /authors?country=BR
```

## 7. Quando usar middleware junto da rota

Se a nova rota precisar validar o corpo, autenticar o usuario ou registrar logs, voce pode passar um middleware antes do handler.

Exemplo:

```ts
router.post('/authors', loggerMiddleware, (req, res) => {
  const { name } = req.body

  res.status(201).json({ id: 1, name })
})
```

No projeto atual, esse padrao faz mais sentido para rotas que realmente dependem de dados no body, como `POST` e `PATCH`.

## 8. Exemplo completo

Este seria um exemplo completo de nova rota seguindo o padrao atual:

```ts
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})
```

Depois de salvar, rode:

```bash
npm run dev
```

Ou, se o servidor ja estiver rodando com `watch`, apenas teste a rota.

## 9. Checklist rapido

- a rota foi criada em `src/routes.ts`
- o metodo HTTP esta correto
- o caminho comeca com `/`
- o status HTTP retornado faz sentido
- o corpo da resposta esta em `json(...)` ou `send(...)`
- se houver validacao, o middleware foi aplicado na rota certa

## 10. Resumo

Neste repositorio, criar uma nova rota normalmente significa editar [../src/routes.ts](../src/routes.ts), registrar um novo endpoint no `router` e testar a URL com o metodo HTTP correspondente.
