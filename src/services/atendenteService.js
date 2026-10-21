import { LOJA, PRODUTOS, formatarPreco } from '../data/boutiqueData';

export const RESPOSTA_ENCAMINHAMENTO =
  'Não tenho essa informação no momento. Por favor, continue o atendimento neste botão.';


/**
 * Normaliza o texto removendo acentuação, convertendo para minúsculas
 * e substituindo pontuações por espaços.
 */
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

/**
 * Processa a pergunta do cliente e retorna a resposta de acordo
 * com as regras e skills da Boutique Layani.
 */
export function responderPergunta(pergunta) {
  const normalizada = normalizarTexto(pergunta);

  if (!normalizada) {
    return 'Por favor, digite sua dúvida para que eu possa ajudar você.';
  }

  // 1. Termos com informações explicitamente não cadastradas
  // Devem ser encaminhados ao atendimento humano (Skill 4)
  const termosNaoInformados = [
    'tamanho',
    'tamanhos',
    'tam',
    'estoque',
    'disponivel',
    'disponibilidade',
    'prazo',
    'dias para entrega',
    'quando chega',
    'previsao',
    'troca',
    'trocas',
    'trocar',
    'devolucao',
    'pagamento',
    'pagamentos',
    'pagar',
    'cartao',
    'credito',
    'debito',
    'parcela',
    'parcelamento',
    'parcelar',
    'pix',
    'boleto',
    'dinheiro',
    'desconto',
    'promocao',
  ];

  const contemTermoNaoInformado = termosNaoInformados.some((termo) => {
    const regex = new RegExp(`\\b${termo}\\b`, 'i');
    return regex.test(normalizada);
  });

  if (contemTermoNaoInformado) {
    return RESPOSTA_ENCAMINHAMENTO;
  }

  // 2. Horário de funcionamento (Skill 2)
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
  const ehPerguntaHorario = termosHorario.some((termo) =>
    normalizada.includes(termo)
  );

  if (ehPerguntaHorario) {
    return `A ${LOJA.nome} funciona de ${LOJA.diasFuncionamento}, das ${LOJA.horarioAbertura} às ${LOJA.horarioFechamento}.`;
  }

  // 3. Taxa de entrega (Skill 3)
  const termosEntrega = ['entrega', 'entregar', 'taxa', 'frete', 'envio'];
  const ehPerguntaEntrega = termosEntrega.some((termo) =>
    normalizada.includes(termo)
  );

  if (ehPerguntaEntrega) {
    return `A taxa de entrega informada é ${formatarPreco(LOJA.taxaEntrega)}.`;
  }

  // 4. Consulta de Preços e Catálogo (Skill 1)
  const produtoCamiseta = PRODUTOS.find((p) => p.id === 1);
  const produtoCalca = PRODUTOS.find((p) => p.id === 2);
  const produtoVestido = PRODUTOS.find((p) => p.id === 3);

  const ehCamiseta =
    /\b(camiseta|camisetas|camisa|camisas|tshirt)\b/.test(normalizada);
  const ehCalca = /\b(calca|calcas|jeans)\b/.test(normalizada);
  const ehVestido = /\b(vestido|vestidos)\b/.test(normalizada);

  if (ehCamiseta && !ehCalca && !ehVestido) {
    return `A camiseta custa ${formatarPreco(produtoCamiseta.preco)}.`;
  }

  if (ehCalca && !ehCamiseta && !ehVestido) {
    return `A calça jeans custa ${formatarPreco(produtoCalca.preco)}.`;
  }

  if (ehVestido && !ehCamiseta && !ehCalca) {
    return `O vestido custa ${formatarPreco(produtoVestido.preco)}.`;
  }

  // Pergunta ampla sobre catálogo / produtos / preços
  const ehCatalogoGeral =
    /\b(catalogo|produtos|itens|precos|roupas|vende|tem aí|tem ai)\b/.test(
      normalizada
    );
  if (ehCatalogoGeral) {
    return `Nosso catálogo conta com:\n• Camiseta: ${formatarPreco(
      produtoCamiseta.preco
    )}\n• Calça jeans: ${formatarPreco(
      produtoCalca.preco
    )}\n• Vestido: ${formatarPreco(produtoVestido.preco)}`;
  }

  // 5. Saudações educadas
  const ehSaudacao =
    /^(ola|oi|opa|bom dia|boa tarde|boa noite|ola tudo bem|oi tudo bem)$/.test(
      normalizada
    );
  if (ehSaudacao) {
    return `Olá! Sou o assistente virtual da ${LOJA.nome}. Como posso ajudar? Você pode perguntar sobre nossos produtos (camiseta, calça jeans ou vestido), horário de funcionamento ou taxa de entrega.`;
  }

  // 6. Agradecimentos
  const ehAgradecimento =
    /\b(obrigado|obrigada|valeu|muito obrigado|muito obrigada|grato|grata)\b/.test(
      normalizada
    );
  if (ehAgradecimento) {
    return `De nada! Se precisar de mais alguma informação sobre a ${LOJA.nome}, estou à disposição.`;
  }

  // 7. Qualquer pergunta desconhecida / não cadastrada (Skill 4)
  return RESPOSTA_ENCAMINHAMENTO;
}
