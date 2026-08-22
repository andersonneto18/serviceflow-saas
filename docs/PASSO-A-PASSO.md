# Passo a Passo — Construção da App

> Checklist de execução, em ordem. Cada passo é pequeno e verificável. Usar este ficheiro para saber sempre "onde ficámos" — marcar `[x]` quando um passo estiver concluído e não avançar para o passo seguinte sem o anterior estar feito.
>
> Referência funcional/técnica completa: [DOCUMENTACAO.md](DOCUMENTACAO.md)

**Decisões já tomadas:**

- Nome da app: placeholder por agora (mudar mais tarde)
- Base de dados: Neon (Postgres serverless na cloud)
- Package manager: pnpm

**Estado atual:** Fase 1 concluída. Fase 2: layout (27-29), schema (21-26), workspace multi-tenant (30-31), Clientes (19, 32-33) e Serviços (35-36) todos feitos, com dados reais e testados. **App já em produção na Vercel**, ligada ao GitHub (`git push` publica automaticamente). Falta: páginas de detalhe (34), filtros (32), e depois Trabalhos (37-41, já pode ligar-se a Clientes e Serviços reais) — dashboard e orçamentos ainda mostram dados de exemplo fixos, por ligar.

**Nota de estrutura:** o código do Next.js vive diretamente na raiz do repositório (não numa subpasta `app/`). Os documentos de planeamento (`DOCUMENTACAO.md`, `PASSO-A-PASSO.md`, `COMANDOS.md`, `interface-referencia.html`) estão organizados dentro de `docs/`. Todos os comandos (`pnpm dev`, `pnpm add`, etc.) correm a partir da raiz do projeto.

**Aviso:** se o servidor de dev começar a devolver 404/500 sem motivo aparente, verificar se não existe uma pasta `app/` fantasma na raiz (`ls`) — já aconteceu ser recriada por um separador aberto no editor a autoguardar um ficheiro dessa pasta antiga. Basta apagá-la (`rm -rf app`) e reiniciar o `pnpm dev`.

---

## Fase 0 — Preparar a máquina

- [x] **Passo 1.** Resolver instalação do `pnpm` (corepack falhou com EPERM). Alternativa: `npm install -g pnpm` ou correr o PowerShell como administrador.
- [x] **Passo 2.** Confirmar versões: `node -v` (v24.17.0), `pnpm -v` (11.21.0), `git --version` (2.54.0).
- [x] **Passo 3.** Inicializar repositório git no diretório do projeto (`git init`).
- [x] **Passo 4.** Criar conta e projeto novo no [Neon](https://neon.tech) (Postgres) e guardar a connection string — guardada em `.env.local` (`DATABASE_URL`).
- [x] **Passo 5.** Criar conta no [Clerk](https://clerk.com) e criar uma aplicação nova (guardar as chaves de API).
- [ ] **Passo 6.** Criar conta no [Cloudflare](https://cloudflare.com) para o R2 — ainda por fazer, só é preciso quando ligarmos upload de fotos/documentos.
- [x] **Passo 7.** Criar conta no [Vercel](https://vercel.com) ligada ao GitHub — já em produção, deploy automático a cada `git push`.

---

## Fase 1 — Fundação do projeto

- [x] **Passo 8.** Criar o projeto Next.js com TypeScript: `pnpm create next-app@latest`.
- [x] **Passo 9.** Verificar que o projeto arranca localmente (`pnpm dev`) e abre no browser.
- [x] **Passo 10.** Configurar Tailwind CSS (já veio incluído no `create-next-app`).
- [x] **Passo 11.** Instalar e configurar `shadcn/ui` (`pnpm dlx shadcn@latest init`) — preset "base-nova", cor de destaque azul definida em `globals.css`.
- [x] **Passo 12.** Adicionar os primeiros componentes shadcn (`avatar`, `badge`, `card`, `table`, `input`, `separator`, `sheet`, `dropdown-menu`, `tabs`, `command`, `sidebar`, `tooltip`, `button`).
- [x] **Passo 13.** Criar ficheiro `.env.local` com as variáveis de ambiente (Neon `DATABASE_URL`) — já protegido pelo `.gitignore` (`.env*`). Chaves Clerk entram quando fizermos o Passo 5.
- [x] **Passo 14.** Instalar Drizzle ORM (`drizzle-orm`, `drizzle-kit`) e o driver Postgres (`@neondatabase/serverless`, driver HTTP — bom para ambientes serverless/edge como o Vercel).
- [x] **Passo 15.** Criar `drizzle.config.ts` a apontar para a base de dados Neon — testado com `drizzle-kit generate`, liga corretamente.
- [x] **Passo 16.** Criar a pasta `src/db/schema` e o ficheiro de conexão à base de dados (`src/db/index.ts`) — schema ainda vazio, tabelas entram no Passo 21+.
- [x] **Passo 17.** Instalar Clerk (`@clerk/nextjs`) e configurar o `src/proxy.ts` (substitui o `middleware.ts` no Next.js 16) de proteção de rotas — feito via Clerk CLI, tipo de projeto **B2B** com Organizações ativas (mapeiam para os nossos Workspaces), Email + Google como métodos de login.
- [x] **Passo 18.** Envolver a app no `<ClerkProvider>` (com tema shadcn via `@clerk/ui`), páginas `/sign-in` e `/sign-up` criadas, grupo `(app)` protegido (redireciona para `/sign-in` se não autenticado) — confirmado a funcionar. Sidebar já mostra o utilizador real (nome/email/avatar) em vez de dados fixos. **Falta:** criar a sua primeira conta de teste (fazer sign-up na app) para confirmarmos o fluxo ponta a ponta.
- [x] **Passo 19.** Instalar `zod` e `react-hook-form` (`@hookform/resolvers`).
- [x] **Passo 20.** Fazer o primeiro commit git (`fundação do projeto`) — feito há muitas mensagens, já com dezenas de commits desde então.

---

## Fase 2 — Esqueleto do produto (MVP)

### 2.1 Modelo de dados base

- [x] **Passo 21.** Definir schema Drizzle: `users`, `workspaces`, `workspace_members` (ligação users↔workspaces com role — enum `administrador/gestor/profissional/visualizacao`).
- [x] **Passo 22.** Definir schema Drizzle: `clients`, `client_addresses`.
- [x] **Passo 23.** Definir schema Drizzle: `services`, `products`.
- [x] **Passo 24.** Definir schema Drizzle: `jobs`, `job_tasks`, `job_notes`, `job_photos` (+ `job_materials`, adicionada mais tarde para o separador "Materiais" do Passo 39).
- [x] **Passo 25.** Definir schema Drizzle: `quotes`, `quote_items`.
- [x] **Passo 26.** Correr a primeira migração (`drizzle-kit generate` + `drizzle-kit migrate`) — 13 tabelas confirmadas na base de dados Neon (consulta direta a `information_schema.tables`).

### 2.2 Layout e navegação

- [x] **Passo 27.** Criar layout principal com **sidebar** (Workspace / Gestão / Comunicação / Sistema) e área de conteúdo — feito com os componentes `Sidebar*` do shadcn/ui. Dashboard com dados de exemplo, mais páginas base de Trabalhos/Clientes/Orçamentos. Falta ainda ligar autenticação (isso é o Passo 17-18, com Clerk).
- [x] **Passo 28.** Implementar sidebar recolhível (modo só-ícones) — já incluído de fábrica no componente `Sidebar` do shadcn (`collapsible="icon"`).
- [x] **Passo 29.** Criar bloco de utilizador no fundo da sidebar (avatar, nome, dropdown Perfil/Preferências/Alterar workspace/Ajuda/Sair) — falta só ligar as ações reais ao Clerk quando fizermos essa parte.
- [x] **Passo 30.** Criar fluxo de "primeiro acesso": ativámos "Membership required" nas Organizações do Clerk (é o valor por defeito) — o próprio Clerk força escolher/criar uma Organização (Workspace) logo a seguir ao registo, antes de conseguir entrar. **Falta confirmar em teste real** (fazer sign-up na app).
- [x] **Passo 31.** Implementar isolamento multi-tenant: `src/lib/workspace.ts` → `getCurrentWorkspace()` é o helper central. Lê o `orgId` ativo do Clerk, sincroniza (cria se não existir) as linhas correspondentes em `users`/`workspaces`/`workspace_members`, e devolve o workspace — todas as queries futuras a dados do negócio devem usar o `workspace.id` daqui. Sincronização feita "on demand" por agora; migrar para webhooks do Clerk mais tarde é uma melhoria futura (não bloqueia o progresso atual).

### 2.3 Clientes

- [x] **Passo 32.** Página de listagem de Clientes — dados reais da base de dados (filtrados por workspace), já sem exemplos fixos. **Falta:** os filtros Todos/Ativos/Potenciais/Inativos (fica para uma iteração seguinte).
- [x] **Passo 33.** Formulário de criar cliente (Zod + React Hook Form, num diálogo) — grava via Server Action (`actions.ts`) diretamente na base de dados. Editar cliente ainda não foi feito.
- [x] **Passo 34.** Página de detalhe do cliente (`/clientes/[id]`) com separadores: Perfil (+ moradas), Histórico (trabalhos), Orçamentos, Notas (editável).

### 2.4 Serviços

- [x] **Passo 35.** Página de catálogo de Serviços (listagem) — dados reais, item ativado na sidebar.
- [x] **Passo 36.** Formulário de criar serviço (nome, descrição, preço, tipo de preço, duração, categoria). Editar ainda não foi feito.
- [x] **Passo 36a** *(não estava numerado, adicionado por pedido)*. Página de **Produtos & Materiais** — mesmo padrão (nome, unidade, preço), tabela `products` do schema, item ativado na sidebar.

### 2.5 Trabalhos

- [x] **Passo 37.** Página de listagem de Trabalhos (tabela: Cliente/Trabalho/Serviço/Data/Estado/Valor) — dados reais, com join a Clientes e Serviços. Coluna "Responsável" fica para quando tivermos Equipa (Passo 66+).
- [x] **Passo 38.** Formulário de criar trabalho, ligado a cliente (obrigatório) + serviço (opcional), com data/hora, localização, valor e estado.
- [x] **Passo 39.** Página de detalhe do trabalho (`/trabalhos/[id]`): Informações, Tarefas (checklist com adicionar/marcar feito), Materiais (adicionar + total), Notas (adicionar) — tudo a gravar de verdade.
- [x] **Passo 40.** Timeline — versão simplificada: mostra Criado, Estado atual e Fatura (se existir/paga). **Não** é o histórico completo de todas as transições de estado (isso exigiria uma tabela de log que não criámos, para não complicar sem necessidade real).
- [x] **Passo 41.** Gestão de estados do trabalho — completo: os 6 estados no formulário, e agora também um seletor direto na tabela para mudar o estado de um trabalho já criado (dispara a automação de faturação ao marcar "Concluído").

### 2.6 Tarefas

- [x] **Passo 42.** Schema Drizzle para `tasks` (título, descrição, responsável, prioridade, prazo, cliente, trabalho relacionado, estado) — migrado para o Neon.
- [x] **Passo 43.** Vista em Lista de tarefas — com checkbox para concluir (Server Action), badge de prioridade, cliente associado (opcional) e prazo. Item ativado na sidebar.
- [x] **Passo 44.** Vista em Kanban (To Do / In Progress / Done) — separador "Kanban" ao lado de "Lista" em Tarefas, arrastar-e-largar nativo do browser (sem biblioteca extra), grava o novo estado ao largar.

### 2.7 Orçamentos

- [x] **Passo 45.** Builder de orçamento em `/orcamentos/novo` — itens dinâmicos (adicionar/remover linhas com `useFieldArray`), desconto e IVA configuráveis, subtotal/total calculados ao vivo no browser.
- [x] **Passo 46.** Botão "Guardar rascunho" — grava com `status: rascunho`.
- [x] **Passo 47.** Botão "Enviar ao cliente" — grava `status: enviado` + `sentAt`, gera `publicToken` (UUID), link público em `/orcamento/[token]` (fora do grupo `(app)`, por isso sem exigir login). Botão "Copiar link" na listagem.
- [x] **Passo 48.** Página pública do orçamento — mostra itens/totais, botões Aceitar/Rejeitar. **Falta:** "Pedir alteração" (só tem Aceitar/Rejeitar por agora).
- [x] **Passo 49.** Automação: ao aceitar, cria um Trabalho automaticamente (`status: agendado`, valor = total do orçamento) e liga `quotes.jobId` a ele — tudo numa Server Action pública (`src/app/orcamento/[token]/actions.ts`).

### 2.8 Agenda

- [x] **Passo 50.** Página de Calendário — vista em lista, agrupada por dia ("Hoje"/"Amanhã"/data), com hora, cliente, localização e estado. Dados reais (`jobs.scheduledAt`), sem tabela nova. **Falta:** os toggles Dia/Semana/Mês em grelha (versão simplificada por agora).
- [x] **Passo 50a** *(não estava numerado, adicionado por pedido)*. Botão "Como chegar" (`src/components/map-link.tsx`) — abre o Google Maps já com a morada como destino, via *Maps URLs* (link público do Google, sem API paga nem conta). Presente no Calendário, no detalhe do Trabalho e nas moradas do Cliente. Substitui a necessidade da funcionalidade "Rotas" (que exigiria uma API de mapas paga) para o caso de uso mais comum: ir ter com o cliente.

**Marco:** no fim da Fase 2, já existe um fluxo funcional completo: `Login → Workspace → Cliente → Serviço → Trabalho → Orçamento → Aceite → Trabalho agendado`.

---

## Fase 3 — Faturação, pagamentos e portal do cliente

- [x] **Passo 51.** Schema Drizzle: `invoices` (com número automático via `generatedAlwaysAsIdentity`), `invoice_items`. **Simplificação:** não criámos tabela `payments` separada — Pagamentos é uma vista calculada sobre `invoices.status`/`dueDate` (evita dois conceitos de estado a divergir). Se um dia precisarmos de pagamentos parciais por fatura, criamos `payments` nessa altura.
- [x] **Passo 52.** Página de listagem de Faturas (Número/Cliente/Vencimento/Estado/Valor) + criar (builder de itens, igual ao de Orçamentos) + enviar + marcar como paga. Editar ainda não foi feito.
- [x] **Passo 53.** Geração de PDF da fatura — biblioteca `@react-pdf/renderer`, gerado a pedido em `/faturas/[id]/pdf` (sem guardar o PDF em lado nenhum, cria na hora), botão "PDF" na listagem de Faturas.
- [x] **Passo 54.** Página de Pagamentos — cards Recebido este mês/Pendente/Atrasado calculados a partir das faturas, + lista. "Atrasado" é calculado (enviada + vencimento passado), não guardado.
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

- [x] **Passo 65.** Permissões já vinham do Passo 21 (`workspace_members.role`). Convites/cargos reais usam antes os cargos nativos do Clerk (`org:admin`/`org:member`) — mais simples que replicar os 4 cargos no Clerk também.
- [x] **Passo 66.** Página de gestão de Equipa (`/equipas`) — lista membros e convites pendentes **direto do Clerk** (não da nossa BD, que só sincroniza no primeiro login de cada pessoa), com diálogo "Convidar membro" (só visível para admins). Remover membro ainda não foi feito.
- [x] **Passo 67.** Atribuição de trabalhos/tarefas a membros da equipa — seletor "Responsável" nos formulários de criar, mostrado na listagem e no detalhe do trabalho. `src/lib/team.ts` sincroniza automaticamente o utilizador atribuído para a nossa BD se ainda não tiver feito login (evita erro de referência estrangeira).
- [x] **Passo 68.** Schema Drizzle para `notifications` + sino de notificações no topo da app — real: mostra por ler, dropdown com lista, marcar uma/todas como lidas, clicar navega para o sítio certo. Interruptor ligar/desligar em Definições → Notificações (`workspace_members.notifications_enabled`), respeitado antes de criar qualquer notificação.
- [x] **Passo 69.** Disparar notificações nos eventos-chave — implementados: **novo cliente**, **orçamento aceite**, **pagamento recebido**, **tarefa atribuída**, **trabalho atribuído** (extra, mesmo padrão). **Não implementados** (precisam de infraestrutura que não temos): "trabalho próximo" (precisaria de um cron/scheduler) e "nova mensagem" (só temos mensagens enviadas por nós, não recebidas — depende do Portal do Cliente).
- [x] **Passo 70.** Schema Drizzle para `messages` + página **Inbox** centralizada — feito fora de ordem, a pedido. Lista mensagens ligadas a clientes (`senderType`: cliente/equipa/sistema) com diálogo "Nova mensagem". Mensagens do tipo "cliente" só vão existir a sério quando o Portal do Cliente (Passo 64) estiver feito; por agora só se envia como "equipa".
- [x] **Passo 71.** **Automação** (`/automacao`) — as duas regras da documentação, cada uma com interruptor ligado/desligado (tabela `automations`, por defeito ativas). Ligadas a gatilhos reais: orçamento aceite → cria trabalho (em `orcamento/[token]/actions.ts`); trabalho marcado como concluído → cria fatura automaticamente (em `trabalhos/actions.ts`, novo `updateJobStatus`). **Simplificação:** não é um motor genérico de regras — as ações estão fixas no código, só o ligado/desligado é configurável. "Notificar"/"pedir avaliação" não estão implementados (sem sistema de notificações nem emails ainda).
- [x] **Passo 72.** Página de Relatórios (`/relatorios`) — receita total (faturas pagas), trabalhos concluídos este mês, clientes novos este mês, taxa de orçamentos aceites. Só agregações sobre tabelas existentes, sem schema novo.
- [x] **Passo 73.** Pesquisa global (Ctrl K / ⌘K) — dados reais via Server Action (`src/components/search-actions.ts`), com debounce de 250ms. Cobre Clientes/Trabalhos/Serviços/Orçamentos/Faturas. **Falta:** Tarefas (não incluída ainda).
- [x] **Passo 73a** *(não estava numerado, adicionado por pedido)*. Página de **Definições** (`/definicoes`) — separadores Perfil e Workspace, usando os componentes prontos do Clerk (`UserProfile`, `OrganizationProfile`) em vez de formulários próprios: avatar, nome, email, segurança, e renomear/apagar workspace já vêm de fábrica. Último item da sidebar por construir que não depende de contas externas (R2/Brevo/Stripe) — só ficam **Portal do cliente** e **Integrações**.

---

## Fase 5 — IA, expansão e polimento

- [ ] **Passo 74.** Configurar OpenAI API e criar o endpoint do **AI Assistant**.
- [ ] **Passo 75.** Expor as funções da app à IA como "tools" (`createQuote`, `getJobs`, `createTask`, etc.) com confirmação antes de ações importantes.
- [ ] **Passo 76.** Interface de chat do AI Assistant dentro da app.
- [ ] **Passo 77.** Internacionalização (i18n): estrutura de traduções PT/EN/ES/FR.
- [ ] **Passo 78.** Configuração de moeda/data/impostos por workspace/país.
- [ ] **Passo 79.** Otimização mobile: bottom navigation, captura de foto nativa, assinatura do cliente no ecrã.
- [ ] **Passo 80.** Configurar PostHog (analytics de uso).
- [ ] **Passo 81.** Rever identidade visual final (cores, logo, nome definitivo da app). **Nome escolhido: NetoWork** (já aplicado — sidebar, título da aba, páginas de login/registo). Falta: favicon próprio (ainda é o do Next.js) e um logótipo desenhado a sério (hoje é só a letra "N" num quadrado).
- [ ] **Passo 82.** Deploy de produção no Vercel + domínio próprio.
- [ ] **Passo 83.** (Opcional, mais tarde) Avaliar app nativa mobile.

---

## Como usar este ficheiro

- Sempre que um passo for concluído, marcar `[x]` e atualizar a secção **"Estado atual"** no topo com o número do próximo passo pendente.
- Não saltar passos de schema de base de dados — cada entidade nova deve ter migração aplicada antes de ser usada na UI.
- Se surgir um passo novo não previsto aqui, adicioná-lo na fase correta em vez de o fazer "à parte", para o ficheiro continuar a ser a fonte única de verdade do progresso.
