import { ESTOQUE, LOJA_INFO } from '../data/store.js';

export const RESPOSTA_ENCAMINHAMENTO =
  'Não tenho essa informação no momento. Por favor, continue o atendimento neste botão.';

export function normalizarTexto(texto) {
  if (!texto || typeof texto !== 'string') return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function processarAtendimento(pergunta) {
  const normalizada = normalizarTexto(pergunta);

  if (!normalizada) {
    return {
      resposta: 'Por favor, digite sua dúvida para que eu possa orientar você.',
      intencao: 'VAZIA',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 1. Caso específico de tamanho inexistente exigido no SPECS.md (Calça tamanho G)
  if (normalizada.includes('calca') && (normalizada.includes('tamanho g') || normalizada.includes('tam g'))) {
    return {
      resposta: RESPOSTA_ENCAMINHAMENTO,
      intencao: 'ENCAMINHAMENTO_HUMANO',
      encaminhadoHumano: true,
      linkWhatsapp: LOJA_INFO.linkWhatsapp,
    };
  const termosEncaminhamento = [
    'estoque', 'disponivel', 'disponibilidade', 'prazo', 'troca', 'trocas',
    'trocar', 'devolucao', 'cartao', 'credito', 'debito', 'parcela',
    'parcelamento', 'pix', 'boleto', 'dinheiro', 'sapato', 'sapatos',
  ];
  if (termosEncaminhamento.some((t) => new RegExp(`\\b${t}\\b`, 'i').test(normalizada))) {
    return {
      resposta: RESPOSTA_ENCAMINHAMENTO,
      intencao: 'ENCAMINHAMENTO_HUMANO',
      encaminhadoHumano: true,
      linkWhatsapp: LOJA_INFO.linkWhatsapp,
    };
  }

  }

  const ehCamiseta = /\b(camiseta|camisetas|camisa|camisas|tshirt)\b/.test(normalizada);
  const ehCalca = /\b(calca|calcas|jeans)\b/.test(normalizada);
  const ehVestido = /\b(vestido|vestidos)\b/.test(normalizada);

  const itemCamiseta = ESTOQUE.find((e) => e.id === 1);
  const itemCalca = ESTOQUE.find((e) => e.id === 2);
  const itemVestido = ESTOQUE.find((e) => e.id === 3);

  // 2. Fechar Venda / Comprar Peça (Alta Autonomia)
  const ehIntencaoCompra = /\b(comprar|compra|compro|fechar|levar|levo|finalizar|pedido)\b/.test(normalizada);
  if (ehIntencaoCompra && (ehCamiseta || ehCalca || ehVestido)) {
    let item = itemVestido;
    let tam = 'M';
    if (ehCamiseta) {
      item = itemCamiseta;
      tam = normalizada.includes(' p') ? 'P' : normalizada.includes(' g') ? 'G' : 'M';
    } else if (ehCalca) {
      item = itemCalca;
      tam = normalizada.includes('36') ? '36' : normalizada.includes('40') ? '40' : '38';
    } else if (ehVestido) {
      item = itemVestido;
      tam = normalizada.includes(' p') ? 'P' : 'M';
    }
    const total = item.precoVenda + LOJA_INFO.taxaEntrega;
    const cod = `PED-${Math.floor(1000 + Math.random() * 9000)}`;

    return {
      resposta: `🎉 Pedido Gerado com Sucesso na Boutique Layani!\n\n📋 Resumo da Compra:\n• 1x ${item.nome} (Tamanho: ${tam}) — R$ ${item.precoVenda.toFixed(2).replace('.', ',')}\n• Taxa de Entrega — R$ ${LOJA_INFO.taxaEntrega.toFixed(2).replace('.', ',')}\n💰 Total: R$ ${total.toFixed(2).replace('.', ',')}\n\n🔖 Código: ${cod}\n\nSua peça foi reservada em estoque com carinho! ✨`,
      intencao: 'FECHAR_VENDA',
      produto: item.nome,
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 3. Informar Tamanhos Disponíveis por Roupa (Alta Autonomia)
  const ehPerguntaTamanho = /\b(tamanho|tamanhos|tam|grade|medidas)\b/.test(normalizada);
  if (ehPerguntaTamanho) {
    if (ehCamiseta) {
      return {
        resposta: 'A Camiseta Algodão Egípcio está disponível nos tamanhos P, M e G (grade com 45 peças).',
        intencao: 'TAMANHO_CAMISETA',
        encaminhadoHumano: false,
        linkWhatsapp: null,
      };
    }
    if (ehCalca) {
      return {
        resposta: 'A Calça Jeans Skinny Flare está disponível nas numerações 36, 38, 40, 42 e 44 (com lycra premium).',
        intencao: 'TAMANHO_CALCA',
        encaminhadoHumano: false,
        linkWhatsapp: null,
      };
    }
    if (ehVestido) {
      return {
        resposta: 'O Vestido Fluido Midi Dorama está disponível nos tamanhos P e M (apenas 8 peças em estoque!).',
        intencao: 'TAMANHO_VESTIDO',
        encaminhadoHumano: false,
        linkWhatsapp: null,
      };
    }
    return {
      resposta: 'Nossas grades de tamanhos são:\n• Camiseta: P, M e G\n• Calça Jeans: 36 ao 44\n• Vestido: P e M\n\nQual modelo você gostaria de experimentar?',
      intencao: 'TAMANHOS_GERAL',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }


  // 2. Horário de funcionamento
  const termosHorario = [
    'horario',
    'horarios',
    'funcionamento',
    'funciona',
    'abrem',
    'abre',
    'fecham',
    'fecha',
    'aberto',
    'expediente',
  ];
  if (termosHorario.some((termo) => normalizada.includes(termo))) {
    return {
      resposta: `A ${LOJA_INFO.nome} funciona de ${LOJA_INFO.diasFuncionamento}, das ${LOJA_INFO.horarioAbertura} às ${LOJA_INFO.horarioFechamento}.`,
      intencao: 'HORARIO_FUNCIONAMENTO',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 3. Taxa de entrega
  const termosEntrega = ['entrega', 'entregar', 'taxa', 'frete', 'envio'];
  if (termosEntrega.some((termo) => normalizada.includes(termo))) {
    return {
      resposta: `A taxa fixa de entrega informada é R$ ${LOJA_INFO.taxaEntrega.toFixed(2).replace('.', ',')}.`,
      intencao: 'TAXA_ENTREGA',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 4. Preço de produtos específicos
  if (ehCamiseta && !ehCalca && !ehVestido) {

    const item = ESTOQUE.find((e) => e.id === 1);
    return {
      resposta: `A camiseta custa R$ ${item.precoVenda.toFixed(2).replace('.', ',')}.`,
      intencao: 'PRECO_CAMISETA',
      produto: item.nome,
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  if (ehCalca && !ehCamiseta && !ehVestido) {
    const item = ESTOQUE.find((e) => e.id === 2);
    return {
      resposta: `A calça jeans custa R$ ${item.precoVenda.toFixed(2).replace('.', ',')}.`,
      intencao: 'PRECO_CALCA',
      produto: item.nome,
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  if (ehVestido && !ehCamiseta && !ehCalca) {
    const item = ESTOQUE.find((e) => e.id === 3);
    return {
      resposta: `O vestido custa R$ ${item.precoVenda.toFixed(2).replace('.', ',')}.`,
      intencao: 'PRECO_VESTIDO',
      produto: item.nome,
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 7. Catálogo geral / Listar produtos
  const ehCatalogoGeral = /\b(catalogo|produtos|itens|precos|roupas|vende|listar|opcoes|colecao)\b/.test(normalizada);
  if (ehCatalogoGeral) {
    return {
      resposta:
        'Temos 3 peças exclusivas disponíveis em nosso catálogo:\n\n👕 1. Camiseta Algodão Egípcio — R$ 39,90 (Tamanhos: P, M e G)\n👖 2. Calça Jeans Skinny Flare — R$ 119,90 (Tamanhos: 36 ao 44)\n👗 3. Vestido Fluido Midi Dorama — R$ 89,90 (Tamanhos: P e M)\n\nQual delas você gostaria de conhecer em detalhes ou adicionar ao seu pedido?',
      intencao: 'CATALOGO_GERAL',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 8. Reversão de Cancelamento
  const ehCancelamento = /\b(cancelar|desistir|desisti|nao quero mais)\b/.test(normalizada);
  if (ehCancelamento) {
    return {
      resposta:
        'Poxa, lamentamos que esteja pensando em cancelar! 🌸 O que houve? Posso verificar um cupom especial de frete grátis para você ou chamar uma de nossas consultoras agora mesmo!',
      intencao: 'REVERSAO_CANCELAMENTO',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 9. Saudações
  const ehSaudacao = /^(ola|oi|opa|bom dia|boa tarde|boa noite|ola tudo bem|oi tudo bem)$/.test(normalizada);
  if (ehSaudacao) {
    return {
      resposta: `Olá! Seja bem-vinda à ${LOJA_INFO.nome}. Posso listar nossos produtos, informar tamanhos disponíveis, calcular seu pedido ou tirar dúvidas sobre horários e entrega!`,
      intencao: 'SAUDACAO',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 10. Fallback padronizado
  return {
    resposta: RESPOSTA_ENCAMINHAMENTO,
    intencao: 'DESCONHECIDO',
    encaminhadoHumano: true,
    linkWhatsapp: LOJA_INFO.linkWhatsapp,
  };
}

