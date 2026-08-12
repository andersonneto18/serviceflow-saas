# Passo a Passo — Construção da App

> Checklist de execução, em ordem. Cada passo é pequeno e verificável. Usar este ficheiro para saber sempre "onde ficámos" — marcar `[x]` quando um passo estiver concluído e não avançar para o passo seguinte sem o anterior estar feito.
>
> Referência funcional/técnica completa: [DOCUMENTACAO.md](DOCUMENTACAO.md)

**Decisões já tomadas:**

- Nome da app: placeholder por agora (mudar mais tarde)
- Base de dados: Neon (Postgres serverless na cloud)
- Package manager: pnpm

**Estado atual:** Fase 1 em curso. Concluídos: Passo 1 (pnpm), Passo 3 (git init na raiz + `.gitignore` + repositório ligado e enviado para [github.com/andersonneto18/appglobal](https://github.com/andersonneto18/appglobal)), Passo 8 (projeto Next.js criado — inicialmente numa subpasta `app/`, depois achatado para a raiz do repositório), Passo 9 (servidor de dev confirmado a correr em `http://localhost:3000` a partir da raiz). Próximo: Passo 4 (conta Neon) e Passo 5 (conta Clerk).

**Nota de estrutura:** o código do Next.js vive diretamente na raiz do repositório (não numa subpasta `app/`). Os documentos de planeamento (`DOCUMENTACAO.md`, `PASSO-A-PASSO.md`, `COMANDOS.md`, `interface-referencia.html`) estão organizados dentro de `docs/`. Todos os comandos (`pnpm dev`, `pnpm add`, etc.) correm a partir da raiz do projeto.

**Aviso:** se o servidor de dev começar a devolver 404/500 sem motivo aparente, verificar se não existe uma pasta `app/` fantasma na raiz (`ls`) — já aconteceu ser recriada por um separador aberto no editor a autoguardar um ficheiro dessa pasta antiga. Basta apagá-la (`rm -rf app`) e reiniciar o `pnpm dev`.

---

## Fase 0 — Preparar a máquina

- [x] **Passo 1.** Resolver instalação do `pnpm` (corepack falhou com EPERM). Alternativa: `npm install -g pnpm` ou correr o PowerShell como administrador.
- [x] **Passo 2.** Confirmar versões: `node -v` (v24.17.0), `pnpm -v` (11.21.0), `git --version` (2.54.0).
- [x] **Passo 3.** Inicializar repositório git no diretório do projeto (`git init`).
- [x] **Passo 4.** Criar conta e projeto novo no [Neon](https://neon.tech) (Postgres) e guardar a connection string — guardada em `.env.local` (`DATABASE_URL`).
- [ ] **Passo 5.** Criar conta no [Clerk](https://clerk.com) e criar uma aplicação nova (guardar as chaves de API).
- [ ] **Passo 6.** Criar conta no [Cloudflare](https://cloudflare.com) para o R2 (pode ser feito mais tarde, só é preciso na Fase 3).
- [ ] **Passo 7.** Criar conta no [Vercel](https://vercel.com) ligada ao GitHub (para deploy, pode ser feito mais tarde).

---

## Fase 1 — Fundação do projeto

- [x] **Passo 8.** Criar o projeto Next.js com TypeScript: `pnpm create next-app@latest`.
- [x] **Passo 9.** Verificar que o projeto arranca localmente (`pnpm dev`) e abre no browser.
- [x] **Passo 10.** Configurar Tailwind CSS (já veio incluído no `create-next-app`).
- [x] **Passo 11.** Instalar e configurar `shadcn/ui` (`pnpm dlx shadcn@latest init`) — preset "base-nova", cor de destaque azul definida em `globals.css`.
- [x] **Passo 12.** Adicionar os primeiros componentes shadcn (`avatar`, `badge`, `card`, `table`, `input`, `separator`, `sheet`, `dropdown-menu`, `tabs`, `command`, `sidebar`, `tooltip`, `button`).
- [x] **Passo 13.** Criar ficheiro `.env.local` com as variáveis de ambiente (Neon `DATABASE_URL`) — já protegido pelo `.gitignore` (`.env*`). Chaves Clerk entram quando fizermos o Passo 5.
- [ ] **Passo 14.** Instalar Drizzle ORM (`drizzle-orm`, `drizzle-kit`) e o driver Postgres (`@neondatabase/serverless` ou `pg`).
- [ ] **Passo 15.** Criar `drizzle.config.ts` a apontar para a base de dados Neon.
- [ ] **Passo 16.** Criar a pasta `db/schema` e o ficheiro de conexão à base de dados (`db/index.ts`).
- [ ] **Passo 17.** Instalar Clerk (`@clerk/nextjs`) e configurar o `middleware.ts` de proteção de rotas.
- [ ] **Passo 18.** Envolver a app no `<ClerkProvider>` e testar login/registo básico (páginas default do Clerk).
- [ ] **Passo 19.** Instalar `zod` e `react-hook-form` (`@hookform/resolvers`).
- [ ] **Passo 20.** Fazer o primeiro commit git (`fundação do projeto`).

---

## Fase 2 — Esqueleto do produto (MVP)

### 2.1 Modelo de dados base

- [ ] **Passo 21.** Definir schema Drizzle: `users`, `workspaces`, `workspace_members` (ligação users↔workspaces com role).
- [ ] **Passo 22.** Definir schema Drizzle: `clients`, `client_addresses`.
- [ ] **Passo 23.** Definir schema Drizzle: `services`, `products`.
- [ ] **Passo 24.** Definir schema Drizzle: `jobs`, `job_tasks`, `job_notes`, `job_photos`.
- [ ] **Passo 25.** Definir schema Drizzle: `quotes`, `quote_items`.
- [ ] **Passo 26.** Correr a primeira migração (`drizzle-kit generate` + `drizzle-kit migrate`) e confirmar tabelas criadas no Neon.

### 2.2 Layout e navegação

- [ ] **Passo 27.** Criar layout principal autenticado com **sidebar** (Workspace / Gestão / Comunicação / Sistema, conforme secção 3 da documentação) e área de conteúdo.
- [ ] **Passo 28.** Implementar sidebar recolhível (modo só-ícones).
- [ ] **Passo 29.** Criar bloco de utilizador no fundo da sidebar (avatar, nome, dropdown Perfil/Preferências/Alterar workspace/Ajuda/Sair via Clerk).
- [ ] **Passo 30.** Criar fluxo de "primeiro acesso": após registo, obrigar a criar um Workspace antes de entrar no dashboard.
- [ ] **Passo 31.** Implementar isolamento multi-tenant: toda a query à BD filtrada por `workspace_id` (middleware/helper central, nunca query solta).

### 2.3 Clientes

- [ ] **Passo 32.** Página de listagem de Clientes (tabela com filtros Todos/Ativos/Potenciais/Inativos).
- [ ] **Passo 33.** Formulário de criar/editar cliente (Zod + React Hook Form).
- [ ] **Passo 34.** Página de detalhe do cliente com separadores: Perfil, Histórico, Orçamentos, Notas (Faturas/Pagamentos/Documentos entram na Fase 3).

### 2.4 Serviços

- [ ] **Passo 35.** Página de catálogo de Serviços (listagem).
- [ ] **Passo 36.** Formulário de criar/editar serviço (nome, descrição, preço, duração, categoria).

### 2.5 Trabalhos

- [ ] **Passo 37.** Página de listagem de Trabalhos (tabela: Cliente/Serviço/Responsável/Data/Estado/Valor).
- [ ] **Passo 38.** Formulário de criar trabalho (ligado a cliente + serviço).
- [ ] **Passo 39.** Página de detalhe do trabalho: Informações, Tarefas (checklist), Materiais, Notas.
- [ ] **Passo 40.** Timeline visual do trabalho (Criado → Orçamento aprovado → Agendado → Em execução → Concluído → Pago).
- [ ] **Passo 41.** Gestão de estados do trabalho (Rascunho/Agendado/Em execução/Em pausa/Concluído/Cancelado).

### 2.6 Tarefas

- [ ] **Passo 42.** Schema Drizzle para `tasks` (título, descrição, responsável, prioridade, prazo, cliente, trabalho relacionado, estado).
- [ ] **Passo 43.** Vista em Lista de tarefas.
- [ ] **Passo 44.** Vista em Kanban (To Do / In Progress / Done).

### 2.7 Orçamentos

- [ ] **Passo 45.** Schema Drizzle já criado no Passo 25 — criar o builder de orçamento (adicionar serviço/quantidade/preço/materiais/desconto/impostos, cálculo de subtotal/IVA/total).
- [ ] **Passo 46.** Botão "Guardar rascunho".
- [ ] **Passo 47.** Botão "Enviar ao cliente" — gerar link público de visualização do orçamento (rota sem autenticação Clerk, com token).
- [ ] **Passo 48.** Página pública do orçamento com ações Aceitar / Rejeitar / Pedir alteração.
- [ ] **Passo 49.** Automação: orçamento aceite → criar Trabalho automaticamente (Server Action).

### 2.8 Agenda

- [ ] **Passo 50.** Página de Agenda com vistas Dia/Semana/Mês, listando trabalhos agendados.

**Marco:** no fim da Fase 2, já existe um fluxo funcional completo: `Login → Workspace → Cliente → Serviço → Trabalho → Orçamento → Aceite → Trabalho agendado`.

---

## Fase 3 — Faturação, pagamentos e portal do cliente

- [ ] **Passo 51.** Schema Drizzle: `invoices`, `invoice_items`, `payments`.
- [ ] **Passo 52.** Página de listagem de Faturas + criar/editar/enviar/marcar como paga.
- [ ] **Passo 53.** Geração de PDF da fatura.
- [ ] **Passo 54.** Página de Pagamentos (cards Recebido/Pendente/Atrasado + lista).
- [ ] **Passo 55.** Configurar conta Stripe (modo teste) e Stripe Billing para os planos da SaaS (Free/Pro/Business).
- [ ] **Passo 56.** Configurar Stripe Connect para pagamento cliente→profissional.
- [ ] **Passo 57.** Ligar botão "Pagar agora" da fatura ao Stripe Checkout/Payment Link.
- [ ] **Passo 58.** Webhook Stripe para atualizar estado da fatura/pagamento automaticamente.
- [ ] **Passo 59.** Configurar Cloudflare R2 (bucket + credenciais) e SDK de upload no backend.
- [ ] **Passo 60.** Upload de fotografias no trabalho (antes/depois), guardando só a referência (`job_photos`) na BD.
- [ ] **Passo 61.** Upload de documentos no cliente.
- [ ] **Passo 62.** Configurar Resend + template de email "Orçamento aprovado".
- [ ] **Passo 63.** Configurar Resend + template de email "Lembrete de visita".
- [ ] **Passo 64.** Criar área pública **Portal do cliente** (login separado ou magic link): ver trabalhos, orçamentos, faturas, pagar, enviar mensagens/fotos, ver documentos e próximas marcações.

---

## Fase 4 — Equipas, automação e operação

- [ ] **Passo 65.** Schema Drizzle para permissões de `workspace_members` (Administrador/Gestor/Profissional/Visualização).
- [ ] **Passo 66.** Página de gestão de Equipa (listar, convidar, remover membros).
- [ ] **Passo 67.** Atribuição de trabalhos/tarefas a membros da equipa.
- [ ] **Passo 68.** Schema Drizzle para `notifications` + sino de notificações no topo da app.
- [ ] **Passo 69.** Disparar notificações nos eventos-chave (novo cliente, orçamento aceite, pagamento recebido/atrasado, trabalho próximo, nova mensagem, tarefa atribuída).
- [ ] **Passo 70.** Schema Drizzle para `messages` + página **Inbox** centralizada.
- [ ] **Passo 71.** Motor de **Automação** simples (regras Quando/Então/E), começando pelos dois exemplos da documentação (orçamento aprovado → criar trabalho + notificar; trabalho concluído → enviar fatura + pedir avaliação).
- [ ] **Passo 72.** Página de Relatórios básicos (receita, trabalhos concluídos, clientes novos por período).
- [ ] **Passo 73.** Pesquisa global (Ctrl K / ⌘K) sobre clientes/trabalhos/tarefas/orçamentos/faturas/serviços.

---

## Fase 5 — IA, expansão e polimento

- [ ] **Passo 74.** Configurar OpenAI API e criar o endpoint do **AI Assistant**.
- [ ] **Passo 75.** Expor as funções da app à IA como "tools" (`createQuote`, `getJobs`, `createTask`, etc.) com confirmação antes de ações importantes.
- [ ] **Passo 76.** Interface de chat do AI Assistant dentro da app.
- [ ] **Passo 77.** Internacionalização (i18n): estrutura de traduções PT/EN/ES/FR.
- [ ] **Passo 78.** Configuração de moeda/data/impostos por workspace/país.
- [ ] **Passo 79.** Otimização mobile: bottom navigation, captura de foto nativa, assinatura do cliente no ecrã.
- [ ] **Passo 80.** Configurar PostHog (analytics de uso).
- [ ] **Passo 81.** Rever identidade visual final (cores, logo, nome definitivo da app).
- [ ] **Passo 82.** Deploy de produção no Vercel + domínio próprio.
- [ ] **Passo 83.** (Opcional, mais tarde) Avaliar app nativa mobile.

---

## Como usar este ficheiro

- Sempre que um passo for concluído, marcar `[x]` e atualizar a secção **"Estado atual"** no topo com o número do próximo passo pendente.
- Não saltar passos de schema de base de dados — cada entidade nova deve ter migração aplicada antes de ser usada na UI.
- Se surgir um passo novo não previsto aqui, adicioná-lo na fase correta em vez de o fazer "à parte", para o ficheiro continuar a ser a fonte única de verdade do progresso.
