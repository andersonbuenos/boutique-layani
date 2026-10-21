# Boutique Layani — Atendimento Virtual & Catálogo (MVP)

Aplicação web responsiva de demonstração educacional da **Boutique Layani**, uma loja fictícia de roupas. O sistema apresenta o catálogo de produtos e um assistente virtual para esclarecimento de dúvidas frequentes dos clientes.

---

## 📋 Sobre o Projeto

O objetivo deste MVP é demonstrar uma solução simples, acessível e sem backend para resolver o atendimento recorrente sobre preços, horários de funcionamento e taxas de entrega, com encaminhamento amigável para atendimento humano para dúvidas não cadastradas ou fora de escopo (como estoque, tamanhos, trocas e pagamentos).

### Dados Oficiais da Loja

- **Nome:** Boutique Layani
- **Horário de Funcionamento:** Segunda a sábado, das 8h às 18h
- **Taxa de Entrega:** R$ 10,00
- **Catálogo:**
  - 👕 **Camiseta:** R$ 39,90
  - 👖 **Calça jeans:** R$ 119,90
  - 👗 **Vestido:** R$ 89,90

---

## 🛠️ Tecnologias Utilizadas

- **React 18** — Biblioteca para construção de interfaces reativas baseadas em componentes
- **Vite 5** — Ferramenta de build rápida e moderna
- **JavaScript (ES6+)** — Linguagem de programação limpa e modular
- **CSS3 Puro** — Variáveis CSS customizadas, Grid, Flexbox e acessibilidade sem dependências externas pesadas
- **Vitest** — Testes unitários para validação de regras de negócio e skills do assistente

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js instalado (versão 18 ou superior)
- npm instalado

### 1. Instalação das dependências

```bash
npm install
```

### 2. Executar em modo de desenvolvimento

```bash
npm run dev
```

Abra o endereço exibido no terminal (geralmente `http://localhost:5173`) no navegador.

### 3. Executar os testes automatizados

```bash
npm test
```

### 4. Gerar build de produção

```bash
npm run build
```

Para visualizar a versão de produção localmente:

```bash
npm run preview
```

---

## 🧠 Habilidades do Assistente Virtual (Skills)

| Habilidade | Entrada de Exemplo | Resposta Esperada |
| :--- | :--- | :--- |
| **Skill 1 — Consultar preços** | "Quanto custa a camiseta?" | "A camiseta custa R$ 39,90." |
| **Skill 1 — Consultar preços** | "Qual o valor da calça?" | "A calça jeans custa R$ 119,90." |
| **Skill 1 — Consultar preços** | "Quanto custa o vestido?" | "O vestido custa R$ 89,90." |
| **Skill 2 — Horário da loja** | "Qual o horário de funcionamento?" | "A Boutique Layani funciona de segunda a sábado, das 8h às 18h." |
| **Skill 3 — Taxa de entrega** | "Qual o valor da entrega?" | "A taxa de entrega informada é R$ 10,00." |
| **Skill 4 — Encaminhar ao humano** | "Tem calça tamanho G?" | "Não tenho essa informação no momento. Por favor, consulte um atendente humano." |
| **Skill 4 — Dúvidas não cadastradas** | "Vocês vendem sapatos?" | "Não tenho essa informação no momento. Por favor, consulte um atendente humano." |
| **Skill 5 — Limpar conversa** | Botão "Limpar conversa" | Reinicia o histórico e exibe a saudação inicial de boas-vindas |

---

## ♿ Acessibilidade e Responsividade

- **Design Responsivo:** Adaptado tanto para dispositivos móveis (Mobile-First) quanto para telas de desktop.
- **Navegação por Teclado:** Foco visível em botões, campos de texto e cartões interativos.
- **Leitores de Tela:** Utilização de `role="log"` com `aria-live="polite"` para atualização do chat, rótulos descritivos com `aria-label` e classes utilitárias `.sr-only`.
- **Áreas de Toque Confortáveis:** Botões com área mínima recomendada (≥ 44px) para fácil interação no celular.

---

## 📁 Estrutura de Pastas

```text
boutique-layani/
├── dist/                          # Build estático de produção
├── src/
│   ├── components/
│   │   ├── Atendimento.css        # Estilos específicos do chat
│   │   ├── Atendimento.jsx        # Componente principal do chat
│   │   ├── Catalogo.jsx           # Grade de exibição dos produtos
│   │   ├── Footer.jsx             # Rodapé com aviso educacional
│   │   ├── Header.jsx             # Cabeçalho da aplicação
│   │   ├── MensagemItem.jsx       # Item individual do histórico
│   │   ├── ProdutoCard.jsx        # Card de produto com atalho para o chat
│   │   └── SugestoesPerguntas.jsx # Botões de perguntas rápidas
│   ├── data/
│   │   └── boutiqueData.js        # Dados da loja e catálogo de produtos
│   ├── services/
│   │   └── atendenteService.js    # Motor de normalização e respostas
│   ├── tests/
│   │   └── atendenteService.test.js # Suíte de testes automatizados
│   ├── App.css                    # Estilos globais e layout
│   ├── App.jsx                    # Componente raiz da aplicação
│   ├── index.css                  # Variáveis e reset CSS
│   └── main.jsx                   # Ponto de entrada React
├── index.html                     # Estrutura HTML da SPA
├── package.json                   # Dependências e scripts npm
├── vite.config.js                 # Configurações do Vite e Vitest
├── PRD.md                         # Product Requirements Document
├── SPECS.md                       # Especificações técnicas do projeto
├── SKILLS.md                      # Definições de habilidades do assistente
├── AGENTS.md                      # Regras de desenvolvimento do agente
└── README.md                      # Instruções e documentação
```

---

## ⚠️ Aviso Legal

Este projeto é uma **demonstração educacional**. Os produtos, preços, regras e atendimentos são fictícios. Nenhuma compra, cobrança ou coleta de informações pessoais sensíveis é realizada.
