# Como criar um novo middleware

Este documento mostra como criar e usar um middleware neste repositorio com Express e TypeScript.

## 1. Onde os middlewares ficam

Os middlewares da aplicacao ficam em [../src/middlewares](../src/middlewares).

Hoje existe este arquivo:

- [../src/middlewares/middleware.ts](../src/middlewares/middleware.ts)

Ele exporta o `loggerMiddleware`, que atualmente faz validacao do corpo da requisicao.

## 2. O que e um middleware

Middleware e uma funcao executada entre a chegada da requisicao e o handler final da rota.

Ela pode:

- validar dados
- bloquear a execucao e retornar erro
- enriquecer o objeto `req`
- registrar logs
- encaminhar o fluxo com `next()`

## 3. Assinatura basica

No Express com TypeScript, um middleware costuma usar estes tipos:

```ts
import { NextFunction, Request, Response } from 'express'

export const meuMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  next()
}
```

Se o middleware decidir continuar o fluxo, ele chama `next()`.

Se quiser interromper, ele retorna uma resposta, por exemplo:

```ts
return res.status(400).json({ message: 'Erro de validacao' })
```

## 4. Como criar um novo middleware

Crie um novo arquivo dentro de `src/middlewares`.

Exemplo:

`src/middlewares/auth-middleware.ts`

Conteudo:

```ts
import { NextFunction, Request, Response } from 'express'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization

  if (!token) {
    return res.status(401).json({ message: 'Token is required' })
  }

  next()
}
```

## 5. Como importar e usar na rota

Depois de criar o middleware, importe em [../src/routes.ts](../src/routes.ts):

```ts
import { authMiddleware } from './middlewares/auth-middleware'
```

E aplique na rota desejada:

```ts
router.get('/profile', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Authorized' })
})
```

Esse padrao e melhor do que aplicar um middleware de validacao em todas as rotas quando so algumas precisam dele.

## 6. Exemplo de middleware de validacao

Se voce quiser validar o corpo de uma requisicao, pode seguir o mesmo estilo do middleware atual do projeto.

Exemplo:

```ts
import { NextFunction, Request, Response } from 'express'

export const validateAuthorMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.body

  if (!name) {
    return res.status(400).json({ message: 'Name is required' })
  }

  if (typeof name !== 'string') {
    return res.status(400).json({ message: 'Name must be a string' })
  }

  next()
}
```

Uso:

```ts
router.post('/authors', validateAuthorMiddleware, (req, res) => {
  const { name } = req.body

  res.status(201).json({ id: 1, name })
})
```

## 7. Quando usar `router.use(...)`

Voce pode usar `router.use(...)` quando o middleware precisa rodar para varias rotas de forma ampla.

Exemplo:

```ts
router.use(authMiddleware)
```

Mas isso deve ser feito com cuidado.

Se o middleware depende de `req.body`, aplicar globalmente pode quebrar rotas como `GET` e `DELETE` que nao enviam corpo.

Por isso, neste projeto, middlewares de validacao de body devem ser aplicados diretamente nas rotas que recebem JSON.

## 8. Boas praticas

- deixe o nome do middleware descritivo
- mantenha uma responsabilidade por middleware
- use `return res.status(...).json(...)` para interromper o fluxo
- chame `next()` apenas quando a requisicao puder continuar
- aplique o middleware no menor escopo possivel

## 9. Resumo

Para criar um novo middleware neste repositorio:

1. crie um arquivo em `src/middlewares`
2. exporte uma funcao com `Request`, `Response` e `NextFunction`
3. implemente a validacao ou regra desejada
4. importe o middleware em [../src/routes.ts](../src/routes.ts)
5. aplique o middleware na rota ou grupo de rotas adequado
