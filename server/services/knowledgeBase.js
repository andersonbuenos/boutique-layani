/**
 * BASE DE CONHECIMENTO OFICIAL & POLÍTICAS — BOUTIQUE LAYANI
 * Especialista: Cipher (Backend, Segurança & Regras de Negócio)
 * 
 * Fonte única de verdade para catálogo, políticas, moda e restrições.
 */

export const LOJA_INFO = {
  nome: 'Boutique Layani',
  descricao: 'Moda feminina exclusiva inspirada em figurinos de doramas e alta costura contemporânea.',
  diasFuncionamento: 'segunda a sábado',
  horarioAbertura: '8h',
  horarioFechamento: '18h',
  taxaEntrega: 10.0,
  linkWhatsapp: 'https://api.whatsapp.com/send?phone=5567991012354&text=Ol%C3%A1%2C%20gostaria%20de%20atendimento%20exclusivo%20na%20Boutique%20Layani%21',
};

export const RESPOSTA_ENCAMINHAMENTO_PADRAO =
  'Não tenho essa informação no momento. Por favor, continue o atendimento neste botão.';

export const RESPOSTA_DESVIO_ESCOPO =
  'Sou a assistente virtual da Boutique Layani e posso te ajudar com nossas roupas, estilos, preços e compras. Gostaria de conhecer nossas peças?';

export const CATALOGO_PRODUTOS = [
  {
    id: 1,
    sku: 'LAY-CAM-001',
    nome: 'Camiseta Algodão Egípcio',
    categoria: 'Vestuário Feminino',
    preco: 39.9,
    gradesValidas: ['P', 'M', 'G'],
    tamanhoPadraoTexto: 'P, M e G',
    modelagem: 'Corte clássico confortável com toque nobre e caimento suave.',
    tecido: 'Algodão egípcio nobre',
    vibeDorama: 'Protagonista de Comédia Romântica',
    ocasiaoRecomendada: ['dia a dia', 'casual', 'passeio', 'trabalho casual', 'encontro descontraído'],
    sinonimos: ['camiseta', 'camisetas', 'camisa', 'camisas', 'tshirt', 't-shirt', 'blusa', 'blusinha', 'algodao egipcio'],
  },
  {
    id: 2,
    sku: 'LAY-CAL-002',
    nome: 'Calça Jeans Skinny Flare',
    categoria: 'Vestuário Feminino',
    preco: 119.9,
    gradesValidas: ['36', '38', '40', '42', '44'],
    tamanhoPadraoTexto: '36, 38, 40, 42 e 44',
    modelagem: 'Skinny flare acinturada com lycra premium, alonga a silhueta e modela com elegância.',
    tecido: 'Jeans com lycra premium',
    vibeDorama: 'Estilo Urbano de Gangnam',
    ocasiaoRecomendada: ['trabalho', 'passeio elegante', 'jantar casual', 'encontro', 'urbano contemporâneo'],
    sinonimos: ['calca', 'calcas', 'calca jeans', 'jeans', 'skinny', 'flare', 'skinny flare'],
  },
  {
    id: 3,
    sku: 'LAY-VES-003',
    nome: 'Vestido Fluido Midi Dorama',
    categoria: 'Vestuário Feminino',
    preco: 89.9,
    gradesValidas: ['P', 'M'],
    tamanhoPadraoTexto: 'P e M',
    modelagem: 'Modelagem acinturada com saia fluida em comprimento midi delicado.',
    tecido: 'Tecido leve e fluido com toque acetinado',
    vibeDorama: 'Cena Romântica sob Trilha Sonora',
    ocasiaoRecomendada: ['encontro romântico', 'jantar', 'festa', 'passeio ao entardecer', 'romântico', 'evento especial'],
    sinonimos: ['vestido', 'vestidos', 'midi', 'vestido midi', 'vestido fluido', 'fluido'],
  },
];

// Mapeamento de itens inexistentes frequentemente pedidos e alternativa cadastrada
export const PRODUTOS_NAO_CATALOGADOS_ALTERNATIVAS = [
  {
    termos: ['saia', 'saias', 'saia plissada', 'plissada', 'minissaia'],
    explicacao: 'No catálogo que tenho acesso, não encontrei saias.',
    sugestaoProdutoId: 3,
    motivoSugestao: 'possui uma proposta delicada, saia fluida e modelagem acinturada inspirada no mesmo romantismo.',
  },
  {
    termos: ['cropped', 'top', 'regata'],
    explicacao: 'No catálogo que tenho acesso, não temos croppeds ou regatas avulsas cadastradas.',
    sugestaoProdutoId: 1,
    motivoSugestao: 'é a peça perfeita para composições casuais elegantes.',
  },

  {
    termos: ['sapato', 'sapatos', 'tenis', 'sandalia', 'salto', 'bota'],
    explicacao: 'A Boutique Layani é especializada exclusivamente em vestuário feminino de alta costura e doramas, não trabalhamos com calçados.',
    sugestaoProdutoId: null,
    motivoSugestao: null,
  },
  {
    termos: ['bolsa', 'bolsas', 'acessorio', 'acessorios', 'joia', 'bijuteria'],
    explicacao: 'No catálogo atual, não temos bolsas ou acessórios cadastrados.',
    sugestaoProdutoId: null,
    motivoSugestao: null,
  },
];

export function formatarBRL(valor) {
  if (typeof valor !== 'number' || isNaN(valor)) return 'R$ 0,00';
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}


