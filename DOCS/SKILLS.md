
# SKILLS — Boutique Layani

## Objetivo

Descrever as habilidades de atendimento
que o sistema deverá implementar.

## Skill 1 — Consultar preços

Entrada:
Pergunta sobre um produto.

Processamento:
Identificar o produto mencionado.
Consultar o catálogo local.

Saída:
Informar o preço cadastrado.

Exemplo:
Cliente: Quanto custa a calça?
Resposta: A calça jeans custa R$ 119,90.

Regra:
Não inventar descontos nem promoções.

## Skill 2 — Informar horário

Entrada:
Pergunta sobre funcionamento.

Processamento:
Consultar as informações da loja.

Saída:
A Boutique Layani funciona de segunda
a sábado, das 8h às 18h.

## Skill 3 — Informar entrega

Entrada:
Pergunta sobre taxa de entrega.

Processamento:
Consultar a taxa cadastrada.

Saída:
A taxa de entrega informada é R$ 10,00.

Regra:
Não informar prazos nem áreas atendidas,
pois esses dados não foram fornecidos.

## Skill 4 — Encaminhar ao humano

Entrada:
Pergunta sem resposta disponível.

Processamento:
Detectar que a informação não está cadastrada.

Saída:
Não tenho essa informação no momento.
Por favor, consulte um atendente humano.

Exemplos de encaminhamento:

- Disponibilidade de estoque
- Tamanhos
- Prazo de entrega
- Trocas
- Pagamentos
- Produtos não cadastrados

## Skill 5 — Limpar conversa

Entrada:
Clique no botão Limpar conversa.

Processamento:
Remover mensagens anteriores da interface.

Saída:
Mostrar a mensagem inicial de boas-vindas.

## Regras gerais

- Responder com educação.
- Ser objetivo.
- Utilizar apenas dados cadastrados.
- Não inventar informações.
- Não realizar operações externas.
