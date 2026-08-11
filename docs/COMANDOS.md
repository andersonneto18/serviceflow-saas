# Comandos — Referência de Terminal

> Todos os comandos que vamos usar para construir a app, explicados. Cada vez que corrermos um comando novo no projeto, ele entra aqui. Isto é para você aprender o que cada um faz — não é só copiar/colar.
>
> Correr sempre a partir da pasta do projeto: `c:\Users\Anderson\Desktop\servicosglobais`

---

## Índice

1. [Ferramentas de base (já feitas)](#1-ferramentas-de-base-já-feitas)
2. [Git — controlo de versões](#2-git--controlo-de-versões)
3. [pnpm — gestor de pacotes](#3-pnpm--gestor-de-pacotes)
4. [Next.js — criar a app](#4-nextjs--criar-a-app)
5. [shadcn/ui — componentes de interface](#5-shadcnui--componentes-de-interface)
6. [Drizzle ORM — base de dados](#6-drizzle-orm--base-de-dados)
7. [Deploy (Vercel)](#7-deploy-vercel)

---

## 1. Ferramentas de base (já feitas)

### `node -v`

Mostra a versão do Node.js instalada. O Node é o motor que corre JavaScript fora do browser — sem ele não conseguimos correr nada em Next.js. *(já confirmámos: v24.17.0)*

### `npm install -g pnpm`

Instala o `pnpm` no computador, de forma global (`-g`), para poder usá-lo em qualquer pasta. *(já feito)*

---

## 2. Git — controlo de versões

Git guarda o histórico de todas as alterações ao código, como um "undo" infinito com checkpoints. Vamos precisar disto assim que começarmos a escrever código a sério.

### `git init`

Transforma a pasta atual num repositório git (começa a "vigiar" alterações). Só se corre uma vez, no início do projeto.

### `git status`

Mostra que ficheiros foram alterados/criados desde o último checkpoint (commit).

### `git add <ficheiro>`

Marca um ficheiro para entrar no próximo checkpoint.

### `git commit -m "mensagem"`

Cria o checkpoint (commit) com os ficheiros marcados, com uma mensagem a explicar o que mudou.

### `git remote add origin <url>`

Regista o endereço do repositório no GitHub como o "destino" para onde vamos enviar o código. Só se corre uma vez. *(já feito — `origin` aponta para `https://github.com/andersonneto18/appglobal.git`)*

### `git push`

Envia os commits guardados localmente para o GitHub. Na primeira vez usa-se `git push -u origin main` (o `-u` liga o ramo local `main` ao remoto, para os pushes seguintes não precisarem de repetir o destino); depois disso, basta `git push`.

### `git pull`

O inverso do push — traz para o computador alterações que estejam no GitHub e não localmente (útil se mexermos no código a partir de outro computador, ou mais tarde com mais pessoas na equipa).

**O nosso ciclo de trabalho a partir de agora:** sempre que terminarmos algo com valor (uma funcionalidade, um passo do checklist), corremos os três em sequência:

```bash
git add .
git commit -m "descrição do que mudou"
git push
```

---

## 3. pnpm — gestor de pacotes

O `pnpm` (como o `npm` ou `yarn`) instala e gere as bibliotecas de código de terceiros que a nossa app usa (Next.js, Tailwind, Drizzle, etc.), chamadas "pacotes" ou "dependências". Escolhemos `pnpm` por ser mais rápido e poupar espaço em disco.

### `pnpm install`

Lê o ficheiro `package.json` (a lista de dependências do projeto) e instala tudo o que lá está. Corremos isto sempre que abrirmos o projeto pela primeira vez ou depois de alguém adicionar uma dependência nova.

### `pnpm add <pacote>`

Adiciona uma nova dependência ao projeto (ex: `pnpm add zod`).

### `pnpm add -D <pacote>`

Igual, mas como "dependência de desenvolvimento" (`-D`) — código só necessário durante o desenvolvimento (ex: ferramentas de tipos), não incluído no site final.

### `pnpm dev`

Arranca o servidor de desenvolvimento — a nossa app fica acessível em `http://localhost:3000` e atualiza sozinha sempre que gravamos um ficheiro. É o comando que vamos usar o dia todo enquanto trabalhamos. *(já confirmado a funcionar — arranca com Turbopack, o empacotador rápido do Next.js, em menos de 1 segundo).*

### `pnpm build`

Prepara a versão final otimizada da app, pronta para produção (mais rápida, código minificado). Não a usamos no dia a dia — só antes de publicar.

---

## 4. Next.js — criar a app

### `pnpm create next-app@latest`

Gera a estrutura inicial de um projeto Next.js — pastas, ficheiros de configuração, um "Hello World" já a funcionar. Por padrão faz perguntas uma a uma (nome, TypeScript, Tailwind, etc.), mas pode receber as respostas diretamente como parâmetros (`--flags`) para não ficar preso num assistente interativo.

**Comando que usámos de facto:**

> Nota: inicialmente criámos o projeto numa subpasta `app/` (por causa do nome `app` dado ao gerador), mas depois decidimos achatar a estrutura — hoje o código do Next.js vive diretamente na raiz do repositório, ao lado dos ficheiros de documentação.

```bash
pnpm dlx create-next-app@latest app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm --disable-git --yes
```

O que cada parâmetro significa:

| Parâmetro | Efeito |
| --- | --- |
| `app` | nome da pasta/projeto a criar |
| `--typescript` | usar TypeScript |
| `--tailwind` | incluir Tailwind CSS já configurado |
| `--eslint` | incluir linter (avisos de erros/más práticas) |
| `--app` | usar o App Router (sistema de rotas mais recente) |
| `--src-dir` | colocar o código dentro de uma pasta `src/` |
| `--import-alias "@/*"` | permite escrever `@/components/x` em vez de caminhos relativos longos |
| `--use-pnpm` | usar o pnpm como gestor de pacotes |
| `--disable-git` | não iniciar git aqui — vamos iniciar um único git na pasta raiz do projeto |
| `--yes` | aceitar os valores por defeito para qualquer opção não especificada acima |

`pnpm dlx` corre o gerador sem o instalar permanentemente (só precisamos dele uma vez). Depois de criado, o dia a dia usa-se com `pnpm dev` (ver secção 3).

---

## 5. shadcn/ui — componentes de interface

O `shadcn/ui` não é uma biblioteca instalada de uma vez só — é um gerador que copia o código de cada componente (botão, card, tabela...) diretamente para dentro do nosso projeto. Isso significa que o componente fica nosso, podemos editá-lo à vontade, sem depender de atualizações externas.

### `pnpm dlx shadcn@latest init`

Configura o projeto para usar shadcn/ui (cria ficheiro de configuração, ajusta o Tailwind). Corre-se uma vez.

### `pnpm dlx shadcn@latest add <componente>`

Adiciona um componente específico ao projeto (ex: `pnpm dlx shadcn@latest add button`). Corremos isto sempre que precisarmos de um componente novo.

> `pnpm dlx` corre um pacote sem o instalar permanentemente no projeto — usa-se para ferramentas que só precisamos de executar uma vez.

---

## 6. Drizzle ORM — base de dados

Um ORM (*Object-Relational Mapper*) permite escrever código TypeScript em vez de SQL puro para falar com a base de dados. O Drizzle também gere as **migrações** — ficheiros que descrevem como a estrutura da base de dados muda ao longo do tempo (criar tabelas, adicionar colunas, etc.), para nunca perdermos o histórico do esquema.

### `pnpm drizzle-kit generate`

Compara o esquema que escrevemos em código (`db/schema`) com o estado atual da base de dados e gera um ficheiro de migração SQL com as diferenças.

### `pnpm drizzle-kit migrate`

Aplica as migrações geradas à base de dados real (Neon), ou seja, cria/altera as tabelas de facto.

### `pnpm drizzle-kit studio`

Abre uma interface visual no browser para ver e editar os dados da base de dados diretamente — útil para inspecionar se algo foi guardado corretamente.

---

## 7. Deploy (Vercel)

Ainda não vamos usar isto (só na Fase 5), mas fica registado:

### `vercel`

Publica a app online a partir da pasta do projeto (pede login na primeira vez).

### `vercel --prod`

Publica diretamente para o domínio de produção (em vez de um link de pré-visualização).

---

## Como usar este ficheiro

- Cada vez que introduzirmos uma ferramenta nova no [PASSO-A-PASSO.md](PASSO-A-PASSO.md), o comando correspondente é acrescentado aqui com a explicação.
- Se esquecer o que um comando faz, é aqui que vem procurar — não precisa de perguntar sempre.
