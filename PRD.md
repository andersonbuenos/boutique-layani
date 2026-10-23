
# PRD — Boutique Layani (Versão 2.5)

## 1. Visão do Produto

A **Boutique Layani** é uma plataforma web fullstack completa de e-commerce e atendimento humanizado para moda feminina exclusiva inspirada em figurinos clássicos de K-Dramas (doramas coreanos). A solução integra catálogo interativo, assistente virtual determinístico de alta autonomia (sem IA), central de chats ao vivo para atendentes, controle de estoque, histórico de vendas, fechamento de pedidos funcional (PIX, Cartão e Entrega), dashboard executivo analítico com **amCharts 5** e banco de dados relacional **MySQL 8.0 em Docker**.

---

## 2. Perfis de Usuário & Controle de Acesso (RBAC)

1. **👑 Administradora (`admin`):**
   - Acesso irrestrito a todas as áreas: Dashboard Executivo, Controle de Estoque, Histórico de Vendas, Central de Chats ao Vivo, Catálogo e Documentação Interativa Swagger API.
2. **💼 Atendente (`atendente`):**
   - Acesso operacional: Central de Chats ao Vivo (monitoramento de sessões com alert dot, atendimento humano com delay de 5s, envio simultâneo e fechamento de vendas), Controle de Estoque e Catálogo.
3. **🛍️ Cliente (`cliente` ou visitante):**
   - Acesso público: Navegação no catálogo com zoom de fotos e modal de dorama, consulta e compras pelo chat com o assistente virtual ou WhatsApp.

---

## 3. Dados Oficiais da Boutique

- **Nome:** Boutique Layani
- **Horário de Funcionamento:** Segunda a sábado, das 8h às 18h
- **Taxa de Entrega:** R$ 10,00 fixa
- **Catálogo de Peças Oficiais:**
  - 👕 **Camiseta Algodão Egípcio:** R$ 39,90 (Tamanhos: P, M e G | 45 peças)
  - 👖 **Calça Jeans Skinny Flare:** R$ 119,90 (Tamanhos: 36, 38, 40, 42 e 44 | 28 peças)
  - 👗 **Vestido Fluido Midi Dorama:** R$ 89,90 (Tamanhos: P e M | 8 peças — Estoque Crítico)

---

## 4. Funcionalidades Principais

### A. Experiência de Compra & Catálogo
- Exibição de cards com efeito hover inteligente (zoom in detalhe ➔ zoom out corpo inteiro).
- Modal expandido com narrativa temática de dorama e botão de ação direta no chat.
- Módulo de **Fechamento de Venda Rápida Realista**:
  - **PIX:** Chave oficial, payload Copia-e-Cola e QR Code.
  - **Cartão de Crédito:** Parcelamento de 1x a 6x sem juros e aprovação instantânea simulada.
  - **Pagar na Entrega:** Opções em Dinheiro (com cálculo automático de troco) ou Maquininha móvel.

### B. Assistente Virtual Autônomo (Sem IA)
- Listagem completa de produtos com preços e tamanhos.
- Orientação de tamanhos por modelo e regras de medidas.
- Fechamento de pedidos com resumo financeiro e código formal (`PED-2026-XXXX`).
- Reversão acolhedora de cancelamentos e dúvidas.
- Encaminhamento com botão oficial de WhatsApp para dúvidas fora de catálogo.

### C. Central de Atendimentos ao Vivo (Chats em Tempo Real)
- Monitoramento com status `ON` (alert dot pulsante) vs `OFF`.
- **"Ver Atendimento":** Modal Inovador de monitoramento com timeline e diagnóstico da cliente.
- **"Assumir Atendimento":** Modal interativo com delay de 5 segundos e saudação oficial do atendente.
- **Conexão Simultânea (0ms Delay):** Troca de mensagens instantânea via BroadcastChannel.
- Fechamento automático do card do assistente após 10 segundos do direcionamento.
- Encerramento de atendimento com remoção automática do card e mensagem calorosa de agradecimento.

### D. Gestão & Business Intelligence (Prisma BI)
- **Dashboard com amCharts 5:**
  - Histórico mensal de faturamento (Line Series).
  - Performance da equipe vs metas mensais (Column Series).
  - Distribuição analítica dos motivos de cancelamento (Donut Chart).
  - Curva de roupas mais vs menos vendidas (Column Series).
- Alertas executivos imediatos de anomalias e rupturas.
- Tabelas auditáveis de vendedores e estoque.

---

## 5. Arquitetura Técnica & Segurança
- **Frontend:** React 18, Vite 5, amCharts 5, CSS modular e responsivo (Mobile-First).
- **Backend:** Node.js, Express, Swagger UI OpenAPI 3.0.
- **Segurança:** Autenticação JWT, senhas com salt hash (`bcryptjs`), bloqueio estrito de criação pública de admin e consultas exclusivas via método `GET`.
- **Banco de Dados:** MySQL 8.0 em Docker com 14 tabelas relacionais, logs de compras detalhadas, telemetria de SEO e data marts analíticos.

