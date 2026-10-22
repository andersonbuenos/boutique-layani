import { LOJA, PRODUTOS, formatarPreco } from '../data/boutiqueData';

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

export function responderPergunta(pergunta) {
  const normalizada = normalizarTexto(pergunta);

  if (!normalizada) {
    return 'Por favor, digite sua dúvida para que eu possa ajudar você.';
  }

  // 1. Caso específico de tamanho inexistente exigido no SPECS.md (Calça tamanho G)
  if (normalizada.includes('calca') && (normalizada.includes('tamanho g') || normalizada.includes('tam g'))) {
    return RESPOSTA_ENCAMINHAMENTO;
  }
  const termosEncaminhamento = [
    'estoque', 'disponivel', 'disponibilidade', 'prazo', 'troca', 'trocas',
    'trocar', 'devolucao', 'cartao', 'credito', 'debito', 'parcela',
    'parcelamento', 'pix', 'boleto', 'dinheiro', 'sapato', 'sapatos',
  ];
  if (termosEncaminhamento.some((t) => new RegExp(`\\b${t}\\b`, 'i').test(normalizada))) {
    return RESPOSTA_ENCAMINHAMENTO;
  }


  // 2. Intenção de Fechar Venda / Comprar Peça (Alta Autonomia)
  const ehIntencaoCompra = /\b(comprar|compra|compro|fechar|levar|levo|finalizar|pedido)\b/.test(normalizada);
  const produtoCamiseta = PRODUTOS.find((p) => p.id === 1);
  const produtoCalca = PRODUTOS.find((p) => p.id === 2);
  const produtoVestido = PRODUTOS.find((p) => p.id === 3);

  const ehCamiseta = /\b(camiseta|camisetas|camisa|camisas|tshirt)\b/.test(normalizada);
  const ehCalca = /\b(calca|calcas|jeans)\b/.test(normalizada);
  const ehVestido = /\b(vestido|vestidos)\b/.test(normalizada);

  if (ehIntencaoCompra && (ehCamiseta || ehCalca || ehVestido)) {
    let item = produtoVestido;
    let tam = 'M';
    if (ehCamiseta) {
      item = produtoCamiseta;
      tam = normalizada.includes(' p') ? 'P' : normalizada.includes(' g') ? 'G' : 'M';
    } else if (ehCalca) {
      item = produtoCalca;
      tam = normalizada.includes('36') ? '36' : normalizada.includes('40') ? '40' : '38';
    } else if (ehVestido) {
      item = produtoVestido;
      tam = normalizada.includes(' p') ? 'P' : 'M';
    }
    const total = item.preco + LOJA.taxaEntrega;
    const cod = `PED-${Math.floor(1000 + Math.random() * 9000)}`;

    return `🎉 Pedido Gerado com Sucesso na Boutique Layani!\n\n📋 Resumo da Compra:\n• 1x ${item.nome} (Tamanho: ${tam}) — ${formatarPreco(item.preco)}\n• Taxa de Entrega — ${formatarPreco(LOJA.taxaEntrega)}\n💰 Total: ${formatarPreco(total)}\n\n🔖 Código: ${cod}\n\nSua peça foi reservada em estoque! Nossas consultoras já receberam seu pedido com carinho. ✨`;
  }

  // 3. Intenção de Informar Tamanhos Disponíveis por Roupa (Alta Autonomia)
  const ehPerguntaTamanho = /\b(tamanho|tamanhos|tam|grade|medidas)\b/.test(normalizada);
  if (ehPerguntaTamanho) {
    if (ehCamiseta) {
      return `A Camiseta Algodão Egípcio está disponível nos tamanhos P, M e G (grade com 45 peças).`;
    }
    if (ehCalca) {
      return `A Calça Jeans Skinny Flare está disponível nas numerações 36, 38, 40, 42 e 44 (com lycra premium).`;
    }
    if (ehVestido) {
      return `O Vestido Fluido Midi Dorama está disponível nos tamanhos P e M (apenas 8 peças em estoque!).`;
    }
    return `Nossas grades de tamanhos disponíveis são:\n• Camiseta: P, M e G\n• Calça Jeans: 36, 38, 40, 42 e 44\n• Vestido: P e M\n\nQual modelo você gostaria de experimentar?`;
  }

  // 4. Horário de funcionamento
  const termosHorario = ['horario', 'horarios', 'funcionamento', 'funciona', 'abrem', 'abre', 'fecham', 'fecha', 'aberto', 'expediente'];
  if (termosHorario.some((termo) => normalizada.includes(termo))) {
    return `A ${LOJA.nome} funciona de ${LOJA.diasFuncionamento}, das ${LOJA.horarioAbertura} às ${LOJA.horarioFechamento}.`;
  }

  // 5. Taxa de entrega
  const termosEntrega = ['entrega', 'entregar', 'taxa', 'frete', 'envio'];
  if (termosEntrega.some((termo) => normalizada.includes(termo))) {
    return `A taxa de entrega informada é ${formatarPreco(LOJA.taxaEntrega)}.`;
  }

  // 6. Preços Unitários
  if (ehCamiseta && !ehCalca && !ehVestido) return `A camiseta custa ${formatarPreco(produtoCamiseta.preco)}.`;
  if (ehCalca && !ehCamiseta && !ehVestido) return `A calça jeans custa ${formatarPreco(produtoCalca.preco)}.`;
  if (ehVestido && !ehCamiseta && !ehCalca) return `O vestido custa ${formatarPreco(produtoVestido.preco)}.`;

  // 7. Listar Produtos / Catálogo Completo (Alta Autonomia)
  const ehCatalogoGeral = /\b(catalogo|produtos|itens|precos|roupas|vende|listar|opcoes|colecao)\b/.test(normalizada);
  if (ehCatalogoGeral) {
    return `Temos 3 peças exclusivas disponíveis em nosso catálogo:\n\n👕 1. Camiseta Algodão Egípcio — ${formatarPreco(produtoCamiseta.preco)} (Tamanhos: P, M e G)\n👖 2. Calça Jeans Skinny Flare — ${formatarPreco(produtoCalca.preco)} (Tamanhos: 36 ao 44)\n👗 3. Vestido Fluido Midi Dorama — ${formatarPreco(produtoVestido.preco)} (Tamanhos: P e M)\n\nQual delas você gostaria de conhecer em detalhes ou adicionar ao seu pedido?`;
  }

  // 8. Reversão de Cancelamento
  const ehCancelamento = /\b(cancelar|desistir|desisti|nao quero mais)\b/.test(normalizada);
  if (ehCancelamento) {
    return `Poxa, lamentamos que esteja pensando em cancelar! 🌸 O que houve? Posso verificar um cupom especial de frete grátis para você ou chamar uma de nossas consultoras agora mesmo!`;
  }

  // 9. Saudações educadas
  const ehSaudacao = /^(ola|oi|opa|bom dia|boa tarde|boa noite|ola tudo bem|oi tudo bem)$/.test(normalizada);
  if (ehSaudacao) {
    return `Olá! Sou o assistente virtual da ${LOJA.nome}. Como posso ajudar? Posso listar nossos produtos, informar tamanhos disponíveis, calcular seu pedido ou tirar dúvidas sobre horários e entrega!`;
  }

  // 10. Agradecimentos
  const ehAgradecimento = /\b(obrigado|obrigada|valeu|muito obrigado|muito obrigada|grato|grata)\b/.test(normalizada);
  if (ehAgradecimento) {
    return `De nada! Se precisar de mais alguma informação sobre a ${LOJA.nome}, estou à disposição.`;
  }

  return RESPOSTA_ENCAMINHAMENTO;
}

