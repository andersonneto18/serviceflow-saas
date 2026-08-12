# Custos — Serviços Externos Necessários

> Lista de tudo o que a app usa de terceiros (hosting, base de dados, emails, pagamentos, etc.), o que é grátis, e a partir de quando começamos a pagar. Preços pesquisados em agosto de 2026 — confirmar sempre no site oficial antes de decidir, porque mudam com frequência.

**Regra geral:** para desenvolver e testar, praticamente tudo tem um nível gratuito suficiente. Os custos reais só aparecem quando há **tráfego/utilizadores a sério** — por isso não há pressa em pagar nada agora.

---

## 💰 Preço total — resposta direta

| Fase | Custo fixo/mês | Custo fixo/ano | + Stripe (variável) |
|---|---|---|---|
| **Agora (a desenvolver)** | **€0** | **€0** | — (ninguém paga ainda) |
| **No dia em que lançar a sério** | **~€20-22/mês** (só Vercel Pro) | **~€260/ano** (+ ~€15 do domínio) | ~1,5% + €0,25 por venda |
| **Com centenas de clientes ativos** | **~€100-150/mês** | **~€1.200-1.800/ano** | ~1,5% + €0,25 por venda |

**A conta simples:** o único dinheiro que sai do seu bolso de forma fixa e garantida é o **Vercel Pro (~€19/mês) + o domínio (~€1,25/mês, pago 1x/ano)** — no total, **cerca de €20/mês (~€250/ano)** para ter a app online a sério com uso comercial. Tudo o resto (base de dados, login, emails, ficheiros) fica dentro do nível grátis até termos um volume de utilizadores considerável. O Stripe nunca é um custo "parado" — só desconta uma pequena percentagem de cada venda real, por isso cresce junto com a receita, nunca à frente dela.

**Ou seja: pode desenvolver tudo sem gastar nada, e o primeiro euro a sério só sai quando decidir publicar a app para o mundo.**

---

## Tabela geral

| Serviço | Para quê | Nível grátis | Quando começa a pagar | Custo típico |
|---|---|---|---|---|
| **Vercel** | Alojar a app (deploy) | Plano Hobby grátis — mas **proíbe uso comercial** | Assim que a app for para produção a sério (uso comercial) | Pro: $20/mês por pessoa, com uso incluído; overages levam um utilizador típico a ~$67/mês |
| **Neon** | Base de dados PostgreSQL | 0,5 GB armazenamento + 100h de computação/mês | Quando a base de dados crescer ou tiver tráfego constante | A partir de ~$0,106/hora de computação + $0,35/GB armazenamento (paga-se só o que se usa) |
| **Clerk** | Autenticação (login/registo) | Até **50.000 utilizadores ativos/mês** | Muito acima do que precisamos no início — dificilmente pagamos já | Pro: $20-25/mês (inclui os 50k grátis; overage $0,02/utilizador) |
| **Resend** | Emails transacionais (orçamento aprovado, faturas, etc.) | 3.000 emails/mês (100/dia) | Quando ultrapassar 3.000 emails/mês | Pro: $20/mês → 50.000 emails |
| **Cloudflare R2** | Guardar fotos e documentos | 10 GB armazenamento + 1M operações/mês | Quando ultrapassar isso (raro no início) | $0,015/GB armazenamento; **sem custo de saída de dados** (diferente da AWS S3) |
| **Stripe** | Pagamentos (SaaS + Stripe Connect) | Não tem "plano" — cobra por transação | Desde a primeira venda | ~1,5% + €0,25 por transação europeia (varia por país/tipo de cartão) |
| **Domínio (.com)** | Endereço da app (ex: `serviza.com`) | Não existe grátis | Assim que quiser sair de `localhost` | ~€12-20/ano no 1º ano, ~€15-25/ano na renovação |
| **PostHog** (opcional) | Analytics de uso | 1 milhão de eventos/mês | Só em escala considerável | Boost: $250/mês (a maioria das apps pequenas nunca chega a pagar) |

---

## Notas importantes

### Stripe não é uma mensalidade
Ao contrário dos outros, o Stripe não tem "plano" — cobra uma **percentagem de cada transação** (~1,5% + €0,25 na Europa). Isto aplica-se duas vezes no nosso modelo:
1. **O profissional paga-nos a subscrição da SaaS** (ex: €19/mês) → Stripe cobra a percentagem sobre isso.
2. **O cliente paga o profissional através da nossa app** (Stripe Connect) → Stripe cobra a percentagem sobre essa transação também (e o Connect tem uma pequena taxa adicional por transferência para a conta do profissional).

Ou seja, quanto mais a app vender, mais paga ao Stripe — mas nunca paga nada se não houver vendas.

### Já temos contas nalguns destes serviços
Reparei que o `.env` que me enviou (de outro projeto seu) já tinha chaves de **Stripe**, **Cloudinary** e **Brevo**. Isso significa que já tem conta nesses serviços — mas para **esta** app precisamos de:
- Chaves Stripe novas (ou as mesmas, mas configuradas para este produto — planos/preços diferentes)
- Decidir: usamos **Cloudflare R2** (o que planeámos) ou reaproveitamos o **Cloudinary** que já tem? Ambos fazem o mesmo (guardar fotos/ficheiros)
- Decidir: usamos **Resend** (o que planeámos) ou o **Brevo** que já tem? Ambos enviam emails — o Brevo até tem um nível grátis maior (9.000 emails/mês vs 3.000 do Resend)

Isto pode poupar-nos de criar contas novas — vale a pena decidir antes de chegarmos à Fase 3 do plano.

### O que realmente custa dinheiro logo no início
Para a fase de desenvolvimento (onde estamos agora), o único custo real e certo é o **domínio** — e mesmo esse só quando quisermos sair do `localhost`. Tudo o resto (Vercel, Neon, Clerk, Resend, R2) tem nível grátis mais do que suficiente para construir e testar a app inteira, e até para os primeiros utilizadores reais.

---

## Cenários de custo mensal estimado

| Fase | Vercel | Neon | Clerk | Resend | R2 | Domínio | **Total/mês** |
|---|---|---|---|---|---|---|---|
| **Desenvolvimento** (só nós a testar) | €0 | €0 | €0 | €0 | €0 | €0 | **€0** |
| **Lançamento pequeno** (dezenas de utilizadores, uso comercial) | ~€20 | €0-5 | €0 | €0 | €0 | ~€1,50 (÷12) | **~€25-30** |
| **Centenas de utilizadores ativos** | ~€67 | ~€10-30 | €0 (< 50k) | €0-20 | €0-5 | ~€1,50 | **~€100-150** |

*(Não incluí o Stripe na tabela porque não é mensalidade fixa — é sempre uma % das vendas reais, nunca um custo "parado".)*

---

## Recomendação

Não pagar nada agora. Continuar a construir e testar tudo nos níveis gratuitos (que já estão praticamente todos configurados: Neon ✅). O primeiro custo real e planeado deve ser o **domínio**, só quando a app estiver pronta para mostrar a alguém fora de nós. O Vercel Pro (o custo mais alto da lista) só é necessário quando decidirmos usar a app comercialmente a sério — até lá, o Hobby chega para desenvolvimento.

---

Sources:
- [Vercel Pricing Plans and Hidden Costs Explained (2026)](https://schematichq.com/blog/vercel-pricing)
- [Vercel Cost in 2026: What You'll Actually Pay](https://makerkit.dev/blog/saas/vercel-cost)
- [Neon Serverless Postgres Pricing 2026](https://vela.simplyblock.io/articles/neon-serverless-postgres-pricing-2026/)
- [Neon Pricing 2026: Plans, Limits & Changes](https://www.saaspricepulse.com/tools/neon)
- [Clerk Pricing Explained](https://clerk.com/articles/clerk-pricing-explained)
- [Clerk Pricing — Free Up to 50K Users](https://clerk.com/pricing)
- [Resend Pricing 2026](https://www.stackscored.com/pricing/transactional-email/resend/)
- [Cloudflare R2 Pricing 2026](https://egresscost.com/cloudflare/)
- [Stripe fees explained: Every rate and cost (2026)](https://checkoutpage.com/blog/stripe-processing-fees)
- [Stripe international fees: what you pay by country in 2026](https://checkoutpage.com/blog/stripe-international-fees)
- [PostHog Pricing 2026](https://www.getpricepulse.com/companies/posthog-pricing.html)
- [Brevo Pricing 2026](https://www.sendx.io/blog/brevo-pricing-plans-costs-alternatives-2026)
- [How Much Does a Domain Name Cost in 2026? (Cybernews)](https://cybernews.com/best-domain-registrars/how-much-does-a-domain-name-cost/)
