/**
 * DETECTOR DE INTENÇÕES & GUARDRAILS DE ESCOPO
 * Especialista: Cipher (Backend, Segurança & Regras de Negócio)
 */

export function detectarDesvioEscopo(normalizada) {
  // 1. Prompt Injection e manipulação de diretrizes
  const padroesInjecao = [
    /\b(ignore|esqueça|esqueca)\b.*\b(regras|instrucoes|diretrizes|instructions)\b/i,
    /\bvoce\s+agora\s+e\b/,
    /\bnova\s+regra\b/,
    /\bjailbreak\b/,
    /\bdeveloper\s+mode\b/,
    /\bact\s+as\b/,
    /\bignore\s+previous\s+instructions\b/,
  ];
  if (padroesInjecao.some((p) => p.test(normalizada))) return true;


  // 2. Programação de software / código
  const padroesCodigo = [
    /\b(escreva|crie|gere|faca)\s+(um\s+)?(codigo|script|funcao|programa|algoritmo)\b/,
    /\b(javascript|python|typescript|java|c\+\+|php|sql|react|html|css)\b/,
  ];
  if (padroesCodigo.some((p) => p.test(normalizada))) return true;

  // 3. Política e eleições
  const padroesPolitica = [
    /\b(politica|eleicao|eleicoes|presidente|deputado|senador|governo|partido\s+politico|votar\s+em)\b/,
    /\b(lula|bolsonaro|esquerda|direita)\b/,
  ];
  if (padroesPolitica.some((p) => p.test(normalizada))) return true;

  // 4. Saúde médica / prescrição de medicamentos
  const padroesSaude = [
    /\b(remedio|medicamento|prescricao|dipirona|paracetamol|antibiotico|tratamento\s+medico|posologia|sintoma|doenca)\b/,
  ];
  if (padroesSaude.some((p) => p.test(normalizada))) return true;

  // 5. Doramas como entretenimento puro (sem ligação com vestuário/estilo da loja)
  const ehDoramaPuro =
    /\b(sinopse|elenco|resumo|episodio|temporada|spoiler|ator|atriz|assistir|netflix|viki|kdrama\s+favorito)\b/.test(normalizada) &&
    !/\b(roupa|vestido|calca|camiseta|look|figurino|moda|estilo|comprar|preco)\b/.test(normalizada);
  if (ehDoramaPuro) return true;

  // 6. Concorrentes diretos
  const padroesConcorrencia = [
    /\b(shein|zara|renner|riachuelo|c&a|shopee|aliexpress|mercado\s+livre)\b/,
  ];
  if (padroesConcorrencia.some((p) => p.test(normalizada))) return true;

  return false;
}

export function classificarIntencoes(normalizada, produtosEncontrados, sessao = null) {
  const intencoes = new Set();

  if (detectarDesvioEscopo(normalizada)) {
    intencoes.add('DESVIO_ESCOPO');
    return Array.from(intencoes);
  }

  // Preço (evita falso positivo quando for exclusivamente 'valor da entrega' ou 'valor do frete')
  const ehApenasValorEntrega = /\bvalor\s+(da\s+)?entrega\b|\bvalor\s+(do\s+)?frete\b/.test(normalizada) && produtosEncontrados.length === 0;
  if (!ehApenasValorEntrega && /\b(preco|precos|custa|custam|valor|valores|quanto\s+(e|custa|sai|ta|fica)|sai\s+por\s+quanto|e\s+caro|e\s+barato)\b/.test(normalizada)) {
    intencoes.add('PRECO');
  }


  // Tamanhos / Grade
  if (/\b(tamanho|tamanhos|tam|grade|medidas|numera|numeracao|caimento|modelagem)\b/.test(normalizada)) {
    intencoes.add('GRADE_TAMANHOS');
  }

  // Dúvida de prazo (exclusiva, não confundir com taxa de frete)
  const ehDuvidaPrazo = /\b(prazo|dias|demora|quando\s+chega|tempo\s+de\s+entrega)\b/.test(normalizada);
  if (ehDuvidaPrazo) {
    intencoes.add('DUVIDA_PRAZO');
  }

  // Taxa de entrega / Frete
  const ehTaxaEntrega =
    /\b(taxa|frete|valor\s+da\s+entrega|custo\s+de\s+entrega|frete\s+fixo)\b/.test(normalizada) ||
    (/\b(entrega|entregar|envio)\b/.test(normalizada) && !ehDuvidaPrazo);
  if (ehTaxaEntrega) {
    intencoes.add('TAXA_ENTREGA');
  }

  // Horário de funcionamento
  if (/\b(horario|horarios|funcionamento|funciona|abrem|abre|fecham|fecha|aberto|expediente)\b/.test(normalizada)) {
    intencoes.add('HORARIO');
  }

  // Reversão de cancelamento (prioritário sobre compra)
  const ehCancelamento = /\b(cancelar|desistir|desisti|nao\s+quero\s+mais)\b/.test(normalizada);
  if (ehCancelamento) {
    intencoes.add('REVERSAO_CANCELAMENTO');
  }

  // Intenção comercial de compra (não ativar se a cliente estiver querendo cancelar)
  const matchCompra = !ehCancelamento && (/\b(comprar|compra|compro|fechar|levar|levo|finalizar|pedir|pedido|quero\s+comprar|quero\s+a|quero\s+o|quero\s+um|quero\s+uma)\b/.test(normalizada) ||
    /^(quero\s+(o\s+|a\s+)?(p|m|g|36|38|40|42|44))$/.test(normalizada) ||
    (sessao && sessao.aguardandoTamanhoProdutoId && /\b(36|38|40|42|44|p|m|g)\b/.test(normalizada)));
  if (matchCompra) {
    intencoes.add('COMPRA_PRE_PEDIDO');
  }

  // Consultoria de moda / Looks / Ocasiões
  if (/\b(look|looks|combinar|combina|combinacao|combino|estilo|romantico|casual|encontro|jantar|passeio|trabalho|festa|dorama|coreano|dica|sugestao|vestir)\b/.test(normalizada)) {
    intencoes.add('CONSULTORIA_MODA');
  }

  // Catálogo geral
  if (/\b(catalogo|produtos|itens|roupas|vende|listar|opcoes|colecao|o\s+que\s+voces\s+tem)\b/.test(normalizada) && produtosEncontrados.length === 0) {
    intencoes.add('CATALOGO_GERAL');
  }

  // Dúvidas que exigem confirmação/encaminhamento (estoque em tempo real, pagamento, troca)
  if (/\b(estoque|disponivel|disponibilidade|tem\s+no\s+estoque|tem\s+disponivel|em\s+falta)\b/.test(normalizada)) {
    intencoes.add('DUVIDA_ESTOQUE');
  }
  if (/\b(cartao|credito|debito|parcela|parcelamento|parcelar|parcelas|juros|pix|boleto|dinheiro)\b/.test(normalizada)) {
    intencoes.add('DUVIDA_PAGAMENTO');
  }
  if (/\b(troca|trocas|trocar|devolucao|devolver|estorno)\b/.test(normalizada)) {
    intencoes.add('DUVIDA_TROCA');
  }

  // Saudações e cortesia
  if (/\b(ola|oi|opa|bom\s+dia|boa\s+tarde|boa\s+noite)\b/.test(normalizada) && !matchCompra && produtosEncontrados.length === 0 && !ehCancelamento) {
    intencoes.add('SAUDACAO');
  }
  if (/\b(obrigado|obrigada|valeu|muito\s+obrigado|muito\s+obrigada|grato|grata)\b/.test(normalizada)) {
    intencoes.add('AGRADECIMENTO');
  }

  return Array.from(intencoes);
}

