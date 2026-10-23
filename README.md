# Boutique Layani — E-commerce & Atendimento Inteligente (Versão 2.5)

Plataforma web fullstack moderna para a **Boutique Layani**, integrando catálogo com narrativas de K-Dramas, assistente virtual autônomo, central de atendimentos ao vivo para atendentes, controle de estoque, vendas com checkout funcional (PIX, Cartão e Entrega), dashboard executivo analítico com **amCharts 5** e banco de dados relacional **MySQL 8.0 em Docker**.

---

## 🛠️ Tecnologias e Arquitetura

- **Frontend:** React 18, Vite 5, amCharts 5, CSS3 modular e responsivo com design system feminino de alta costura.
- **Backend:** Node.js, Express, autenticação JWT, senhas com hash `bcryptjs` e documentação Swagger UI OpenAPI 3.0.
- **Banco de Dados:** MySQL 8.0 em container Docker com persistência em volume `mysql_data`, pool `mysql2/promise` com tolerância a falhas e 14 tabelas relacionais.
- **Tempo Real Simultâneo:** `BroadcastChannel` para troca instantânea de mensagens entre clientes e atendentes com latência zero.

---

## 👥 Acesso com Perfis Pré-Configurados (RBAC)

A aplicação conta com três perfis prontos para teste com 1 clique na tela de apresentação ou login:

| Perfil | E-mail | Senha | Telas Permitidas |
| :--- | :--- | :--- | :--- |
| **👑 Administradora** | `admin@boutiquelayani.com.br` | `Admin@Layani2026` | Todas as telas: Dashboard amCharts, Estoque, Vendas, Chats ao Vivo, Catálogo e Swagger API |
| **💼 Atendente** | `atendente@boutiquelayani.com.br` | `Atendente@2026` | Chats ao Vivo (monitoramento e atendimento), Estoque e Catálogo |
| **🛍️ Cliente** | `cliente@gmail.com` | `Cliente@2026` | Catálogo com zoom e modal de doramas, Chat com Assistente e Checkout |

---

## 🚀 Como Executar Localmente

### Opção 1: Rodando com Docker (Recomendado)

```bash
# Sobe o banco de dados MySQL e a aplicação completa:
docker compose up -d

# Verifique os containers ativos:
docker ps
```
Acesse:
- **Aplicação:** `http://localhost:3001`
- **Swagger Docs (Admin):** `http://localhost:3001/api-docs`
- **MySQL Host:** `localhost:3306`

### Opção 2: Desenvolvimento Local Node.js

```bash
# 1. Instalar dependências:
npm install

# 2. Iniciar o servidor backend (porta 3001):
node server/index.js

# 3. Em outro terminal, iniciar o frontend Vite (porta 5173):
npm run dev

# 4. Executar os 30 testes automatizados:
npm test
```

---

## 🛍️ Fechamento de Vendas Realista

Tanto a cliente quanto o atendente no chat podem fechar pedidos completos:
1. **PIX (Instantâneo):** Exibe QR Code ilustrado, chave PIX oficial (`5567991012354`), código copia-e-cola e confirmação.
2. **Cartão de Crédito:** Parcelamento de 1x a 6x sem juros, validação e código de autorização imediato.
3. **Pagar na Entrega (Dinheiro):** Pergunta se precisa de troco e calcula o valor a ser levado pelo entregador.
4. **Pagar na Entrega (Maquininha):** Opção Débito/Crédito na máquina móvel levada pelo entregador.

---

## 📊 Dashboard Estratégico com amCharts 5

Acesso exclusivo para **Admin**:
- **Alertas Críticos:** Ruptura de estoque de vestido, taxa de cancelamentos por dúvida de tamanho e metas em risco.
- **Gráficos amCharts 5:**
  - Histórico mensal de faturamento (Line Series).
  - Vendedores: Realizado vs Meta (Column Series com rótulos inclinados a -20°).
  - Motivos de Cancelamento (Donut Chart com legenda de valores).
  - Roupas Mais vs Menos Vendidas (Column Series).
- **Tabela Auditável de Vendedoras:** Metas, atingimento, conversão e status.

---

## 💬 Central de Chats ao Vivo (Para Atendentes e Admin)

- **Cards com Status ON/OFF:** Ficam OFF por padrão e acionam **alert dot pulsante** quando um cliente interage.
- **Ver Atendimento:** Modal inovador de console de concierge com histórico da conversa e diagnóstico do Prisma BI.
- **Assumir Atendimento:** Inicia transição com delay regressivo de 5 segundos e apresentação oficial do atendente.
- **Conexão Simultânea (0ms Delay):** Mensagens enviadas aparecem no mesmo instante para cliente e atendente.
- **Fechamento Automático:** O card anterior do assistente é removido após 10 segundos do direcionamento, e o atendimento finalizado fecha o card da lista ativa.

---

## 🧪 Testes Automatizados

O projeto possui 30 testes automatizados cobrindo regras de atendimento, segurança de senhas, emissão de JWT, contratos REST e banco de dados:

```bash
npm test
```

