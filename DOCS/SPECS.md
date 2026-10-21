
# SPECS — Boutique Layani

## 1. Arquitetura do MVP

Aplicação web local, sem backend.

Tecnologias:
React
Vite
JavaScript
CSS

Não utilizar APIs externas nem serviços pagos.

## 2. Estrutura de dados

Produto:
id: identificador
nome: texto
preco: número

Produtos iniciais:
1.Camiseta — 39.90
2.Calça jeans — 119.90
3.Vestido — 89.90

Loja:
-nome
-diasFuncionamento
-horarioAbertura
-horarioFechamento
-taxaEntrega

Mensagem:
-id
-autor: cliente ou assistente
-texto
-dataHora

## 3. Interface

Uma única página contendo:

### Cabeçalho

-Nome Boutique Layani
-Descrição: Atendimento virtual demonstrativo

### Catálogo

- Card da camiseta
- Card da calça jeans
- Card do vestido
- Preços formatados em reais

### Atendimento

- Histórico de mensagens
- Campo para digitar pergunta
- Botão Enviar
- Botão Limpar conversa
- Botões de perguntas sugeridas

### Rodapé

Aviso: demonstração educacional com dados fictícios.

## 4. Comportamento do assistente

Identificar perguntas por palavras-chave normalizadas.

Remover diferenças de maiúsculas/minúsculas
e acentos ao comparar as perguntas.

Assuntos conhecidos:

- Horário de funcionamento
- Preço da camiseta
- Preço da calça jeans
- Preço do vestido
- Taxa de entrega

Para consultas desconhecidas:
"Não tenho essa informação no momento.
Por favor, consulte um atendente humano."

Não informar disponibilidade de estoque ou tamanhos.

## 5. Requisitos de acessibilidade

- Layout adaptável ao celular.
- Campos com rótulos acessíveis.
- Navegação por teclado.
- Botões grandes o suficiente para toque.
- Contraste adequado.
- Mensagens legíveis sem rolagem horizontal.
- Uso de regiões acessíveis para novas respostas.

## 6. Persistência

Usar estado local do React.

Opcionalmente, manter a conversa em localStorage.
Não armazenar dados pessoais.

## 7. Testes mínimos

Pergunta: "Quanto custa a camiseta?"
Resultado: R$ 39,90.

Pergunta: "Qual o horário?"
Resultado: segunda a sábado, das 8h às 18h.

Pergunta: "Qual o valor da entrega?"
Resultado: R$ 10,00.

Pergunta: "Tem calça tamanho G?"
Resultado: encaminhar para atendente humano.

Pergunta: "Vocês vendem sapatos?"
Resultado: não inventar informações.

## 8. Execução

Disponibilizar os comandos:
npm install
npm run dev
npm run build

Documentar tudo no README.md.
