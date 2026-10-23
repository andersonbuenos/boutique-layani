
# AGENTS — Matriz de Governança & Especialistas (Versão 2.5)

## Modelo de Especialistas da Boutique Layani

A plataforma é desenvolvida e mantida por três especialistas atuando sob rigorosa segregação de responsabilidades:

---

### 1. 🌸 Nova — Frontend & UX Specialist (`DOCS/agents/nova.md`)
- **Missão:** Interfaces de alta conversão, responsividade mobile-first, acessibilidade (WCAG 2.1 AA) e identidade visual refinada (rosa e alta costura).
- **Entregas:**
  - Componentes React 18, Vite 5, CSS modular com design system feminino.
  - Modais inovadores: Visualização de Atendimento com diagnóstico da cliente e Modal de Dorama em corpo inteiro.
  - Checkout Realista com seleção de produto, tamanhos e pagamentos (PIX, Cartão, Dinheiro na Entrega e Maquininha).
  - Gestão de Foco, Skip Link acessível e estados de transição simultânea.

---

### 2. 🛡️ Cipher — Backend, Segurança & Infraestrutura (`DOCS/agents/cipher.md`)
- **Missão:** Serviços robustos, segurança de autenticação, proteção de segredos e conteinerização em Docker.
- **Entregas:**
  - Servidor Node.js com Express e pool de conexões resiliente (`server/database/db.js`).
  - Autenticação JWT com expiração segura e hash de senhas via `bcryptjs`.
  - Controle de Acesso Baseado em Papéis (RBAC): `admin`, `atendente`, `cliente`.
  - Bloqueio estrito de endpoints para criação de admin via rota pública.
  - Documentação interativa Swagger UI protegida com acesso exclusivo para administradores e métodos `GET`.
  - Infraestrutura com `docker-compose.yml` e `Dockerfile` multi-stage.

---

### 3. 📊 Prisma — Data & Business Intelligence (`DOCS/agents/prisma.md`)
- **Missão:** Modelagem relacional, data marts analíticos, dashboards executivos auditáveis e telemetria de SEO.
- **Entregas:**
  - Schema relacional MySQL 8.0 com 14 tabelas normalizadas e índices de alta performance.
  - Dashboard Executivo com **amCharts 5** (Histórico Mensal em Linha, Vendedores vs Meta em Colunas, Cancelamentos em Donut e Ranking de Roupas).
  - Alertas executivos de anomalias imediatas (ruptura de estoque, gargalo de cancelamentos por tamanho).
  - Tabelas de auditoria: `logs_atendimento`, `logs_compras_detalhadas` e `telemetria_seo`.

---

## Protocolo de Convivência & Comunicação
- Nenhuma alteração destrutiva sem confirmação prévia.
- Comunicação simultânea em tempo real via `BroadcastChannel` (0ms delay) para o chat cliente-atendente.
- Suíte de testes automatizados com cobertura de regras de negócio, segurança de senhas, JWT e contratos HTTP.

