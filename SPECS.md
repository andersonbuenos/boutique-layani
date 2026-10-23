
# SPECS — Boutique Layani (Versão 2.5)

## 1. Arquitetura da Plataforma

Aplicação fullstack de alta performance, conteinerizada em Docker e sem dependência de serviços externos de IA paga.

- **Frontend:** React 18, Vite 5, amCharts 5 (versão CDN oficial para gráficos interativos), CSS3 puro modular com tokens customizados.
- **Backend:** Node.js, Express, middlewares de segurança JWT e validação de papéis (RBAC).
- **Banco de Dados:** MySQL 8.0 em container Docker com persistência em volume `mysql_data` e pool de conexões com tolerância a falhas (`mysql2/promise`).
- **Comunicação em Tempo Real:** Sincronização simultânea (0ms de atraso) via `BroadcastChannel` para troca de mensagens entre abas de cliente e atendente.

---

## 2. Modelagem Relacional & Schemas (MySQL 8.0)

1. `usuarios`: Credenciais com hash bcrypt, papel (`admin`, `atendente`, `cliente`).
2. `categorias`: Segmentação de vestuário.
3. `produtos`: SKU, preços, custos, tamanhos e narrativas de dorama.
4. `estoque`: Quantidade, estoque de segurança e alertas de reposição.
5. `vendedores`: Metas mensais, vendas realizadas e taxa de conversão.
6. `pedidos` & `pedido_itens`: Cabeçalhos e itens com código oficial `PED-2026-XXXX`.
7. `atendimentos` & `atendimento_mensagens`: Sessões ao vivo (`on`/`off`, `bot`/`humano`).
8. `fato_vendas_mensal`: Data Mart agregada de 6 meses para o amCharts 5.
9. `fato_motivos_cancelamento`: Análise quantitativa de cancelamentos.
10. `logs_atendimento`, `logs_compras_detalhadas`, `telemetria_seo`: Auditoria do Prisma BI.

---

## 3. Endpoints da API REST

- **Autenticação:**
  - `POST /api/auth/login`: Autentica usuário e emite JWT.
  - `POST /api/auth/register`: Cadastro forçado em papel `cliente` (bloqueia criação de admin).
  - `GET /api/auth/me`: Retorna perfil logado.
- **Módulos Administrativos (Somente GET para consultas):**
  - `GET /api/estoque`: Restrito a `admin` e `atendente`.
  - `GET /api/vendas`: Restrito exclusivamente a `admin`.
  - `GET /api/dashboard`: Restrito exclusivamente a `admin` (KPIs e amCharts).
  - `GET /api-docs`: Swagger UI exclusivo para `admin` com token Bearer.
- **Central de Atendimentos:**
  - `GET /api/atendimentos`: Lista cards com status `ON`/`OFF`.
  - `POST /api/atendimentos/:id/assumir`: Assume com delay de 5s.
  - `POST /api/atendimentos/:id/responder`: Envia mensagem simultânea.
  - `POST /api/atendimentos/:id/encerrar`: Finaliza atendimento e fecha card.
- **Vendas & Checkout:**
  - `POST /api/vendas/checkout`: Fecha pedido com PIX, Cartão ou Pagamento na Entrega.
- **Públicos:**
  - `GET /api/produtos`, `GET /api/loja`, `POST /api/chat`.

---

## 4. Comportamento do Assistente Virtual & Central

1. **Listar Produtos:** Retorna lista com camiseta, calça e vestido, seus valores e tamanhos.
2. **Informar Tamanhos:** Informa grades oficiais (Camiseta: P/M/G; Calça: 36 ao 44; Vestido: P/M).
3. **Fechar Venda:** Calcula valor com taxa de entrega (R$ 10,00) e emite resumo formal.
4. **Reverter Cancelamento:** Tenta retenção com cupom de frete grátis antes de encaminhar.
5. **Transição de Atendimento:** Ao assumir, exibe mensagem do sistema, aguarda 5s e apresenta o atendente logado.
6. **Fechamento de Card:** Fecha automaticamente o card do assistente após 10s do direcionamento e fecha o card ao encerrar o atendimento.

