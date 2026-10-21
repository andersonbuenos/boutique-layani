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

  // 1. Termos explicitamente não informados (tamanhos, estoque, prazos, trocas, pagamentos)
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

  const contemNaoInformado = termosNaoInformados.some((termo) => {
    const regex = new RegExp(`\\b${termo}\\b`, 'i');
    return regex.test(normalizada);
  });

  if (contemNaoInformado) {
    return {
      resposta: RESPOSTA_ENCAMINHAMENTO,
      intencao: 'ENCAMINHAMENTO_HUMANO',
      encaminhadoHumano: true,
      linkWhatsapp: LOJA_INFO.linkWhatsapp,
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
  const ehCamiseta = /\b(camiseta|camisetas|camisa|camisas|tshirt)\b/.test(normalizada);
  const ehCalca = /\b(calca|calcas|jeans)\b/.test(normalizada);
  const ehVestido = /\b(vestido|vestidos)\b/.test(normalizada);

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

  // Catálogo geral
  const ehCatalogoGeral = /\b(catalogo|produtos|itens|precos|roupas|vende)\b/.test(normalizada);
  if (ehCatalogoGeral) {
    return {
      resposta:
        'Nosso catálogo conta com:\n• Camiseta: R$ 39,90\n• Calça jeans: R$ 119,90\n• Vestido: R$ 89,90',
      intencao: 'CATALOGO_GERAL',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // Saudações
  const ehSaudacao = /^(ola|oi|opa|bom dia|boa tarde|boa noite|ola tudo bem|oi tudo bem)$/.test(normalizada);
  if (ehSaudacao) {
    return {
      resposta: `Olá! Seja bem-vinda à ${LOJA_INFO.nome}. Posso informar sobre os preços de nossas peças, horário de funcionamento ou taxa de entrega. Como posso ajudar?`,
      intencao: 'SAUDACAO',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // Fallback padronizado
  return {
    resposta: RESPOSTA_ENCAMINHAMENTO,
    intencao: 'DESCONHECIDO',
    encaminhadoHumano: true,
    linkWhatsapp: LOJA_INFO.linkWhatsapp,
  };
}
