# Documentação — SaaS Global de Gestão de Serviços

> Documento único que consolida todo o planeamento do produto: conceito, especificação funcional, arquitetura técnica e roadmap.

---

## Índice

1. [Visão geral e conceito central](#1-visão-geral-e-conceito-central)
2. [Exemplo de uso real](#2-exemplo-de-uso-real)
3. [Design geral](#3-design-geral)
4. [Especificação funcional](#4-especificação-funcional)
5. [Arquitetura técnica](#5-arquitetura-técnica)
6. [Modelo de dados](#6-modelo-de-dados)
7. [Multi-tenant (Workspaces)](#7-multi-tenant-workspaces)
8. [Internacionalização](#8-internacionalização)
9. [Experiência mobile](#9-experiência-mobile)
10. [Identidade visual](#10-identidade-visual)
11. [Roadmap por fases](#11-roadmap-por-fases)

---

## 1. Visão geral e conceito central

Uma aplicação SaaS web moderna, profissional e responsiva destinada a profissionais e empresas que prestam qualquer tipo de serviço: eletricistas, jardineiros, canalizadores, técnicos, freelancers, fotógrafos, designers, empresas de limpeza, manutenção, construção, consultores e muitos outros.

**Ideia central:**

> "Gerir qualquer serviço, num só lugar."

A plataforma permite gerir o negócio desde o primeiro contacto com o cliente até à conclusão e pagamento do serviço.

**Princípio fundamental:** a aplicação **não** deve ser construída para uma profissão específica. É uma plataforma universal.

- Um eletricista pode utilizá-la.
- Um jardineiro pode utilizá-la.
- Um fotógrafo pode utilizá-la.
- Um canalizador pode utilizá-la.
- Uma empresa de limpeza pode utilizá-la.
- Um freelancer pode utilizá-la.
- Uma empresa de manutenção pode utilizá-la.

O utilizador configura o seu próprio fluxo:

```
Clientes → Serviços → Trabalhos → Tarefas → Orçamentos → Pagamentos
```

A plataforma adapta-se ao negócio, não o contrário. O software não precisa de saber que o utilizador é eletricista — é o utilizador que configura os serviços que presta.

**Sensação final pretendida:** quando alguém abre a aplicação, deve pensar:

> "Finalmente tenho tudo o que preciso para gerir o meu negócio num único lugar."

O produto deve ser suficientemente simples para um profissional sozinho utilizar, mas suficientemente poderoso para uma empresa com várias equipas crescer dentro da plataforma. Arquitetura preparada para escalar para milhões de utilizadores.

---

## 2. Exemplo de uso real

Um caso concreto para ilustrar o fluxo completo, com João, eletricista que trabalha sozinho e recebe pedidos pelo WhatsApp:

**1. Chega um cliente**

Cliente pede: *"Olá, preciso instalar 6 tomadas numa casa."*

João abre a app → `+ Criar` → `Novo cliente`:

```
João Silva
+351 912 345 678
Lisboa, Rua X
```

Cria o trabalho:

```
Instalação de 6 tomadas
📅 Quarta-feira, 10:00
📍 Lisboa
👤 Cliente: João Silva
```

**2. Cria o orçamento**

Dentro do trabalho: `Criar orçamento`

| Item | Quantidade | Preço |
|---|---|---|
| Tomada | 6 | €60 |
| Cabo | 30m | €45 |
| Mão de obra | 1 | €180 |

**Total: €285**

`Enviar ao cliente` → o cliente recebe um link com o orçamento e o botão **[Aceitar orçamento]**.

Ao aceitar, automaticamente:

```
Orçamento aprovado ✅ → Trabalho criado/agendado 📅
```

**3. Execução do trabalho**

Na quarta-feira, João abre a app no telemóvel e vê a agenda do dia. Abre o trabalho e segue um checklist:

```
☑ Levar material
☑ Chegar ao local
☐ Instalar tomadas
☐ Testar instalação
☐ Tirar fotografias
☐ Finalizar trabalho
```
 
Tira 3 fotografias diretamente pela aplicação e marca `Trabalho → Concluído ✅`.

**4. Pagamento**

A app pergunta: *"Criar fatura de €285?"* → João confirma.

O cliente recebe: *"Serviço concluído. Fatura #1042 — €285 [Pagar agora]"*. O cliente paga e João vê `€285 — Pago ✅`.

**5. Inteligência do sistema (sugestões automáticas)**

A app percebe que João costuma fazer manutenção elétrica a cada 12 meses e sugere:

> 💡 O cliente João Silva realizou uma instalação há 12 meses. Desejas criar um lembrete de manutenção?

João clica `[Criar lembrete]`. Um ano depois, a app avisa: 🔔 *"João Silva — possível manutenção"*.

**O mais importante:** João não precisa de pensar em "CRM", "ERP" ou "gestão de projetos". Para ele, a app simplesmente faz:

```
Cliente → Orçamento → Agendamento → Trabalho → Fotos → Fatura → Pagamento → Próximo serviço
```

O mesmo sistema serve um jardineiro (`Cliente → orçamento de manutenção → visitas recorrentes → tarefas → fotos → pagamento`), um fotógrafo (`Cliente → orçamento → sessão → tarefas → entrega → pagamento`) ou um canalizador (`Cliente → diagnóstico → orçamento → reparação → materiais → fatura`). É esta abstração universal que torna o produto interessante.

---

## 3. Design geral

Interface:

- moderna, minimalista, premium, profissional
- muito limpa, intuitiva, rápida
- responsiva — preparada para desktop, tablet e mobile

Inspiração na qualidade visual de produtos SaaS modernos como **Linear, Stripe, Notion e Vercel**, sem copiar nenhum deles. Bastante espaço em branco, tipografia moderna, cards discretos, bordas suaves, ícones simples e hierarquia visual muito clara. Deve parecer um produto SaaS internacional pronto para ser comercializado.

### Sidebar principal

Sidebar vertical fixa à esquerda, recolhível para mostrar apenas ícones.

Topo: `[LOGO] [NOME DA APP]`

**Workspace**
- Dashboard
- Inbox
- Calendário
- Trabalhos
- Tarefas
- Clientes
- Orçamentos
- Faturas
- Pagamentos

**Gestão**
- Serviços
- Produtos & Materiais
- Equipas
- Rotas
- Relatórios
- Automação

**Comunicação**
- Mensagens
- Portal do cliente
- Notificações

**Sistema**
- Integrações
- Definições

Fundo da sidebar: avatar do utilizador, nome, cargo, e dropdown com Perfil / Preferências / Alterar workspace / Ajuda / Sair.

---

## 4. Especificação funcional

### 4.1 Dashboard

Primeira página após o login.

- Saudação: `"Bom dia, [Nome] 👋"` + subtexto `"Aqui está o resumo do teu negócio."`
- Canto superior direito: pesquisa, notificações, botão `+ Criar` (com opções: Novo cliente, Novo trabalho, Novo orçamento, Nova tarefa, Nova fatura, Novo serviço)

**Métricas principais (4 cards):**

| Card | Exemplo |
|---|---|
| Receita | €12.480 · +12,4% este mês |
| Trabalhos ativos | 24 · 8 para esta semana |
| Orçamentos pendentes | €8.420 · 12 aguardando resposta |
| Clientes | 184 · +14 este mês |

### 4.2 Agenda

Secção "Agenda de hoje" com eventos mostrando: hora, cliente, tipo de serviço, localização, profissional responsável, estado. Alternância entre **Dia / Semana / Mês**.

### 4.3 Trabalhos

Tabela: `Cliente | Serviço | Responsável | Data | Estado | Valor`

**Estados possíveis:** Rascunho, Agendado, Em execução, Em pausa, Concluído, Cancelado.

Ao abrir um trabalho, mostrar:

- **Informações**: Cliente, Morada, Telefone, Serviço, Data, Hora, Responsável
- **Tarefas**: checklist de subtarefas (ex.: Contactar cliente, Preparar materiais, Executar serviço, Fotografias finais, Fechar trabalho)
- **Materiais**: lista de materiais usados com preço
- **Fotografias**: upload de fotos antes/depois
- **Notas**: campo de notas internas
- **Timeline**: `Criado → Orçamento aprovado → Agendado → Em execução → Concluído → Pago`

### 4.4 Clientes (CRM)

Lista com: nome, empresa, telefone, email, localização, número de trabalhos, valor total, último contacto, estado.

**Filtros:** Todos / Ativos / Potenciais / Inativos.

Ao abrir um cliente:

- **Perfil**: Nome, Contacto, Email, Moradas
- **Histórico**: todos os trabalhos realizados
- **Orçamentos**: enviados e respetivos estados
- **Faturas**: emitidas
- **Pagamentos**: realizados e pendentes
- **Notas**: internas
- **Documentos**: associados ao cliente

### 4.5 Orçamentos

O utilizador adiciona: Serviço, Quantidade, Preço, Materiais, Desconto, Impostos.

```
Instalação elétrica — €350
Materiais — €120
Mão de obra — €280

Subtotal: €750
IVA: €172,50
Total: €922,50
```

Botões: **Guardar rascunho** / **Enviar ao cliente**.

Quando enviado, o cliente recebe um link para visualizar o orçamento e pode: aceitar, rejeitar ou pedir alteração.

> Quando o cliente aceita → **cria automaticamente um Trabalho.**

### 4.6 Portal do cliente

Área completamente separada, com interface extremamente simples. O cliente consegue:

- ver os seus trabalhos
- consultar orçamentos e aceitá-los
- consultar faturas e efetuar pagamentos
- enviar mensagens e fotografias
- consultar documentos
- ver próximas marcações

O cliente **não** tem acesso a informações internas da empresa.

### 4.7 Serviços (catálogo)

Cada serviço pode ter: nome, descrição, preço, duração estimada, materiais, impostos, imagem, categoria.

```
Instalação elétrica — €80/h
Manutenção de jardim — €50
Reparação — Preço variável
```

O utilizador personaliza completamente os serviços para o seu negócio. A aplicação não assume nenhuma profissão específica — sistema universal.

### 4.8 Tarefas

Mini project manager. Cada tarefa tem: título, descrição, responsável, prioridade, prazo, cliente, trabalho relacionado, estado.

- **Estados:** To Do, In Progress, Done
- **Prioridades:** Baixa, Normal, Alta, Urgente
- **Visualizações:** Lista, Kanban

### 4.9 Equipa

Mostrar: Avatar, Nome, Função, Trabalhos ativos, Disponibilidade.

Permitir: adicionar/remover membro, definir permissões, atribuir trabalhos e tarefas.

**Permissões:** Administrador, Gestor, Profissional, Visualização.

### 4.10 Pagamentos

Cards: Recebido este mês (€8.240) · Pendente (€3.120) · Atrasado (€840).

Lista: Cliente, Fatura, Valor, Data, Estado.

**Estados:** Pago, Pendente, Atrasado, Reembolsado.

Arquitetura preparada para integração futura com Stripe e outros métodos de pagamento.

### 4.11 Faturas

Lista: Número, Cliente, Data, Vencimento, Valor, Estado.

Permitir: criar, editar, enviar, descarregar PDF, marcar como paga.

A arquitetura deve permitir adicionar posteriormente sistemas fiscais específicos de diferentes países.

### 4.12 Inbox

Caixa de entrada centralizada para mensagens de clientes, equipa e notificações do sistema. Interface entre email e chat moderno.

### 4.13 Pesquisa global

Acessível via **⌘K / Ctrl K**. Pesquisa em: clientes, trabalhos, tarefas, orçamentos, faturas, serviços — com resultados agregados (ex.: pesquisar "João Silva" mostra Cliente · 3 trabalhos · 2 orçamentos · 4 faturas).

### 4.14 Inteligência Artificial (AI Assistant)

O utilizador escreve comandos naturais, por exemplo:

- "Mostra-me todos os trabalhos desta semana."
- "Cria um orçamento para João Silva de €850."
- "Quais clientes têm pagamentos atrasados?"
- "Agenda a manutenção da Maria para sexta-feira às 14h."
- "Cria tarefas para este trabalho."

A IA interpreta o pedido e chama funções reais da aplicação (ex. `createQuote()`, `getJobs({ date: tomorrow })`), apresentando confirmação antes de executar ações importantes. Assim a IA não inventa informação — trabalha sobre os dados reais da aplicação.

### 4.15 Notificações

Para: novo cliente, novo orçamento, orçamento aceite, pagamento recebido, pagamento atrasado, trabalho próximo, nova mensagem, tarefa atribuída.

### 4.16 Automação

Regras do tipo `Quando → Então → E`, por exemplo:

```
Quando: Orçamento aprovado
Então: Criar trabalho
E: Enviar mensagem ao cliente
```

```
Quando: Trabalho concluído
Então: Enviar fatura
E: Pedir avaliação ao cliente
```

### 4.17 Página de login

Página premium: logo centrado, `"Bem-vindo de volta"`, campos Email/Password, botão `[Entrar]`, "Continuar com Google", link "Esqueceste-te da password?", e opções de Registar empresa / Recuperar password.

---

## 5. Arquitetura técnica

### 5.1 Stack principal

| Área | Tecnologia | Para quê? |
|---|---|---|
| Frontend + Backend | Next.js + TypeScript | Aplicação inteira |
| UI | Tailwind CSS + shadcn/ui | Interface e componentes |
| Base de dados | PostgreSQL | Clientes, trabalhos, pagamentos etc. |
| ORM | Drizzle ORM | Comunicar com PostgreSQL |
| Autenticação | Clerk (ou Auth.js mais tarde) | Login, sessões, utilizadores, organizações |
| Validação | Zod | Validar dados |
| Formulários | React Hook Form | Formulários complexos |
| Pagamentos | Stripe (+ Stripe Connect) | Subscrições SaaS + pagamentos dos clientes ao profissional |
| Ficheiros | Cloudflare R2 | Fotos, documentos, PDFs |
| Email | Resend | Emails e notificações |
| Deploy | Vercel | Colocar a aplicação online |
| Analytics | PostHog | Comportamento dos utilizadores |
| IA | OpenAI API | Assistente de IA (fase posterior) |
| Estado local | Zustand | **Só quando necessário** — não é dependência obrigatória desde o início |

### 5.2 Decisão de arquitetura: sem backend separado

**Não** criar um backend separado tipo Express/NestJS:

```
❌ Next.js → Express/NestJS → PostgreSQL
```

Para o MVP:

```
✅            Next.js
                 │
       ┌─────────┴─────────┐
       │                   │
    Frontend            Backend
       │                   │
       └─────────┬─────────┘
                 │
            PostgreSQL
```

Usando **Server Components**, **Route Handlers** e **Server Actions** do Next.js conforme o caso. Isto reduz bastante a complexidade.

### 5.3 Evolução da arquitetura (quando crescer)

No início, tudo simples:

```
Next.js · PostgreSQL · Stripe · R2 · Resend · Clerk
```

Quando a aplicação crescer muito (não desde o início):

```
                    Next.js
                       │
          ┌────────────┼────────────┐
          │            │            │
       Database      Queue        Storage
          │            │            │
      PostgreSQL      Redis         R2
          │
       Workers
          │
      Background Jobs
```

**Princípio orientador:** não introduzir IA, automações, microserviços, Redis, Kubernetes etc. no primeiro MVP. Só adicionar Zustand quando existir realmente estado global complexo no cliente.

### 5.4 Pagamentos — dois fluxos distintos

**1. O profissional paga a nossa SaaS** (Stripe Billing):

| Plano | Preço |
|---|---|
| Free | €0 |
| Pro | €19/mês |
| Business | €49/mês |

**2. O cliente paga o profissional** (Stripe Connect):

```
Eletricista → Orçamento €500 → Cliente aceita → Cliente paga → Stripe → Profissional recebe
```

### 5.5 Ficheiros (fotos e documentos)

Não guardar ficheiros diretamente no PostgreSQL. Guardar o ficheiro no Cloudflare R2 e na BD apenas a referência:

```
photo
 ├── jobId
 ├── url
 ├── type
 └── createdAt
```

### 5.6 Emails (Resend)

Exemplos de disparo automático: orçamento aprovado, lembretes de visita agendada.

### 5.7 IA — abordagem faseada

Não incluir IA no início. Depois de a aplicação funcionar:

```
AI Assistant → OpenAI API → Ferramentas da aplicação → (Clientes, Trabalhos, Orçamentos, Agenda)
```

A IA chama funções reais da app (`createQuote()`, `getJobs()`, etc.) em vez de inventar dados.

---

## 6. Modelo de dados

Estrutura inicial de tabelas PostgreSQL:

```
users
workspaces
workspace_members

clients
client_addresses

services
products

jobs
job_tasks
job_notes
job_photos

quotes
quote_items

invoices
invoice_items

payments

notifications
messages
```

O conceito mais importante do modelo de dados é o **Workspace** (ver secção 7).

---

## 7. Multi-tenant (Workspaces)

A aplicação é multi-tenant desde o início. Um utilizador pode pertencer a um ou vários **Workspaces / Empresas**. Cada workspace possui os seus próprios: clientes, trabalhos, equipa, serviços, faturas, configurações.

**Nunca misturar dados entre empresas.**

Exemplo:

```
Workspace: João Eletricista
│
├── Clientes
├── Serviços
├── Trabalhos
├── Orçamentos
├── Faturas
└── Equipa

Workspace: Maria Jardins
│
├── Clientes
├── Serviços
├── Trabalhos
├── Orçamentos
├── Faturas
└── Equipa
```

A aplicação é a mesma para todos — os dados é que são isolados por workspace.

---

## 8. Internacionalização

Preparada desde o início para: **Português, Inglês, Espanhol, Francês** (e outros idiomas posteriormente).

Moeda configurável: EUR, USD, GBP, etc.

Data, hora, moeda e impostos configuráveis por país.

---

## 9. Experiência mobile

Primeiro uma **Web App responsiva em Next.js** — não começar com React Native. O profissional acede via `app.nome.com` no telemóvel ou computador.

No mobile:

- sidebar transforma-se em bottom navigation
- dashboard adaptado
- criação rápida de trabalho
- tirar fotografias diretamente pelo telemóvel
- localização/mapa
- assinatura do cliente
- atualização do estado do trabalho

O profissional deve conseguir gerir o negócio inteiro a partir do telemóvel. Mais tarde, se fizer sentido, considerar app nativa.

Exemplo de UI mobile (agenda do dia):

```
┌─────────────────────┐
│ Olá, João 👋        │
│                     │
│ Hoje                │
│                     │
│ 09:00 Cliente A     │
│ 11:30 Cliente B     │
│ 15:00 Cliente C     │
│                     │
├─────────────────────┤
│ 🏠  📅  ➕  👥  ⋯  │
└─────────────────────┘
```

---

## 10. Identidade visual

Usar:

- fundo claro, branco, cinza muito suave
- texto escuro
- uma cor principal de destaque
- cards com bordas subtis
- sombras muito suaves
- border-radius moderno

Evitar:

- excesso de gradientes e de cores
- interfaces demasiado coloridas
- aparência de template genérico
- excesso de elementos no dashboard

A interface deve transmitir: **confiança + simplicidade + tecnologia + produtividade.**

---

## 11. Roadmap por fases

### Fase 1 — Fundação
Next.js, TypeScript, Tailwind, shadcn/ui, PostgreSQL, Drizzle, Clerk.

### Fase 2 — MVP
```
Login → Workspace → Dashboard → Clientes → Serviços → Trabalhos → Tarefas → Orçamentos → Agenda
```

### Fase 3 — Faturação e portal
Faturas, Pagamentos, Portal do cliente, Emails, Fotos/documentos.

### Fase 4 — Colaboração
Equipas, Permissões, Automação, Notificações, Relatórios.

### Fase 5 — Expansão
IA, Stripe Connect, Integrações, Mobile, Internacionalização.

**Recomendação de arranque:** começar apenas com Next.js + TypeScript + Tailwind + shadcn/ui + PostgreSQL + Drizzle. É suficiente para uma primeira versão séria, sem construir uma arquitetura gigantesca antes de existirem utilizadores reais.
