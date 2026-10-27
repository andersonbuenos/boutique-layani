
# SKILLS — Boutique Layani (Versão 2.5)

## Objetivo
Descrever as habilidades de atendimento do assistente virtual autônomo (SEM IA) e a integração com o atendimento humano especializado.

---

## Skill 1 — Consultar Preços
- **Entrada:** Pergunta sobre o valor de um modelo específico (Camiseta, Calça Jeans, Vestido).
- **Processamento:** Reconhecimento por palavras-chave normalizadas.
- **Saída:** Informar o preço oficial (R$ 39,90, R$ 119,90, R$ 89,90).

## Skill 2 — Informar Horário de Funcionamento
- **Entrada:** Dúvidas sobre horários e dias de atendimento.
- **Saída:** A Boutique Layani funciona de segunda a sábado, das 8h às 18h.

## Skill 3 — Informar Taxa de Entrega
- **Entrada:** Consulta sobre frete ou envio.
- **Saída:** A taxa fixa de entrega informada é R$ 10,00.

## Skill 4 — Informar Tamanhos Disponíveis (Nova Autonomia)
- **Entrada:** Pergunta sobre a grade de tamanhos de uma peça.
- **Saída:**
  - Camiseta: P, M e G (45 peças em estoque).
  - Calça Jeans: 36, 38, 40, 42 e 44 (modelagem acinturada com lycra).
  - Vestido: P e M (8 peças — estoque exclusivo).

## Skill 5 — Listar Catálogo Completo (Nova Autonomia)
- **Entrada:** Solicitação da lista de produtos ou opções da coleção.
- **Saída:** Lista estruturada das 3 peças com valores e tamanhos disponíveis.

## Skill 6 — Fechar Vendas & Gerar Pedido (Nova Autonomia)
- **Entrada:** Intenção de compra do cliente (*"quero comprar o vestido tamanho M"*).
- **Processamento:** Cálculo do valor com taxa fixa de entrega de R$ 10,00.
- **Saída:** Resumo formal com código `PED-XXXX`, itens, frete, valor total e reserva imediata.

## Skill 7 — Reversão de Cancelamento
- **Entrada:** Manifestação de desistência da cliente.
- **Saída:** Acolhimento caloroso com oferta de assistência humana e cupom de frete grátis.

## Skill 8 — Encaminhar para Atendente com Botão WhatsApp
- **Entrada:** Dúvidas fora de catálogo (ex: calça tamanho G, sapatos, perfumes).
- **Saída:** *"Não tenho essa informação no momento. Por favor, continue o atendimento neste botão."* + Botão oficial de WhatsApp.

## Skill 9 — Assumir Atendimento Humano Simultâneo (Atendente)
- **Processamento:**
  1. Sistema avisa: *"Direcionando seu atendimento para um atendente especializado..."*
  2. Delay obrigatório de 5 segundos.
  3. Mensagem oficial: *"[Nome do Atendente]: Olá, meu nome é [Nome do Atendente], como posso te ajudar? Insira sua dúvida abaixo."*
  4. Comunicação instantânea (0ms delay) via BroadcastChannel.
  5. Fechamento automático do card do assistente após 10 segundos.

## Skill 10 — Encerrar Atendimento & Agradecimento
- **Processamento:** Atendente clica em "Encerrar Atendimento".
- **Saída:** Remoção automática do card da lista ativa e envio de mensagem de agradecimento:
  *"Atendimento com nossa especialista finalizado com muito carinho! Agradecemos por escolher a Boutique Layani. Se precisar de mais alguma coisa ou quiser tirar novas dúvidas, estou sempre por aqui à sua disposição. Tenha um dia maravilhoso e repleto de elegância! ✨🌸"*


## Skill 11 — Assistente Groq AI com Guardrails & Cortesia
- **Objetivo:** Oferecer consultoria conversacional de alta autonomia sobre moda, estilo, ocasiões e figurinos de K-Drama com o modelo `qwen/qwen3.8-27b` via Groq Cloud API.
- **Guardrail 1 (Domínio Estrito):** Responde exclusivamente sobre a Boutique Layani, moda feminina, tecidos e catálogo.
- **Guardrail 2 (Bloqueio Categórico):** Recusa com delicadeza e charme perguntas sobre política, guerras, geopolítica e notícias gerais.
- **Guardrail 3 (Blindagem Anti-Leakage):** Proteção em dupla camada impedindo menção ou vazamento de dados de usuários `admin`/`atendente`, tokens JWT e chaves de API (`GROQ_API_KEY`).
- **Guardrail 4 (Cortesia e Carisma):** Tom acolhedor de concierge de alta costura com vocabulário empático e refinado.
- **Resiliência (Fallback Automático):** Em caso de ausência de chave ou falha de conectividade, ativa o motor determinístico oficial sem interrupção de serviço.

