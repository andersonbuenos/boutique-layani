import camisetaImg from '../assets/camiseta-egipcia.jpg';
import calcaImg from '../assets/calça.png';
import vestidoImg from '../assets/vestido.png';
import blazerImg from '../assets/blazera-alfaiataria.jpg';
import blusaSedaImg from '../assets/blusa-seda.jpg';
import saiaMidiImg from '../assets/saia-midi.jpg';
import conjuntoTweedImg from '../assets/conjunto-tweed.jpg';
import macacaoImg from '../assets/macacao-pantalona.jpg';

export const LOJA = {
  nome: 'Boutique Layani',
  descricao: 'Atendimento virtual e moda feminina exclusiva',
  diasFuncionamento: 'segunda a sábado',
  horarioAbertura: '8h',
  horarioFechamento: '18h',
  taxaEntrega: 10.0,
};

export const PRODUTOS = [
  {
    id: 1,
    nome: 'Camiseta',
    nomeCompleto: 'Camiseta Algodão Egípcio',
    preco: 39.9,
    categoria: 'Vestuário',
    tamanhos: ['P', 'M', 'G'],
    imagem: camisetaImg,
    icone: '👕',
    vibeDorama: 'Protagonista de Comédia Romântica',
    descricaoDorama:
      'Inspirada no estilo casual e irresistível das protagonistas de k-dramas em Seul. O visual perfeito para aquele encontro despretensioso em uma cafeteria fofa com o herdeiro chaebol disfarçado. Confortável, versátil e cheia de charme natural!',
  },
  {
    id: 2,
    nome: 'Calça jeans',
    nomeCompleto: 'Calça Jeans Skinny Flare',
    preco: 119.9,
    categoria: 'Vestuário',
    tamanhos: ['36', '38', '40', '42', '44'],
    imagem: calcaImg,
    icone: '👖',
    vibeDorama: 'Estilo Urbano de Gangnam',
    descricaoDorama:
      'A clássica calça jeans com caimento impecável, digna das cenas de correria romântica sob o guarda-chuva amarelo ou do dia a dia da mocinha batalhadora que conquista todos pela sua determinação. Uma peça coringa que rouba a cena em qualquer episódio!',
  },
  {
    id: 3,
    nome: 'Vestido',
    nomeCompleto: 'Vestido Fluido Midi Dorama',
    preco: 89.9,
    categoria: 'Vestuário',
    tamanhos: ['P', 'M'],
    imagem: vestidoImg,
    icone: '👗',
    vibeDorama: 'Cena em Câmera Lenta com Trilha Sonora',
    descricaoDorama:
      'Aquele look marcante do momento em que o vento sopra suavemente e a trilha sonora romântica toca ao fundo. Fluido, delicado e encantador, é perfeito para o grande baile de gala ou para aquele reencontro inesperado sob as cerejeiras em flor!',
  },
  {
    id: 4,
    nome: 'Blazer Seul',
    nomeCompleto: 'Blazer Alfaiataria Seul',
    preco: 189.9,
    categoria: 'Alfaiataria Nobre',
    tamanhos: ['P', 'M', 'G'],
    imagem: blazerImg,
    icone: '🧥',
    vibeDorama: 'Herdeira Chaebol & CEO Empoderada',
    descricaoDorama:
      'Corte de alfaiataria impecável estruturado com linho misto nobre ideal para o clima brasileiro. Ombreiras discretas e botões perolados que transmitem autoridade, elegância e poder refinado dignos de uma protagonista de drama corporativo de Seul.',
  },
  {
    id: 5,
    nome: 'Blusa de Seda',
    nomeCompleto: 'Blusa de Seda Gola Laço Gangnam',
    preco: 98.9,
    categoria: 'Vestuário Sofisticado',
    tamanhos: ['P', 'M', 'G'],
    imagem: blusaSedaImg,
    icone: '👚',
    vibeDorama: 'Romance Delicado no Escritório',
    descricaoDorama:
      'Seda acetinada com toque suave na pele e gola com laço clássico removível. O equilíbrio perfeito entre a delicadeza romântica coreana e o caimento sensual elegante brasileiro para jantares ou encontros especiais.',
  },
  {
    id: 6,
    nome: 'Saia Midi Plissada',
    nomeCompleto: 'Saia Midi Plissada Hanbok Chic',
    preco: 109.9,
    categoria: 'Vestuário Sofisticado',
    tamanhos: ['P', 'M', 'G'],
    imagem: saiaMidiImg,
    icone: '🥻',
    vibeDorama: 'Passeio Romântico ao Entardecer',
    descricaoDorama:
      'Inspirada na silhueta tradicional do Hanbok combinada à alfaiataria contemporânea. O plissado perfeito confere movimento hipnotizante ao caminhar, com cintura alta que modela e valoriza a silhueta com extrema classe.',
  },
  {
    id: 7,
    nome: 'Conjunto Tweed',
    nomeCompleto: 'Conjunto Tweed Chaebol Elegance',
    preco: 229.9,
    categoria: 'Alta Costura',
    tamanhos: ['P', 'M'],
    imagem: conjuntoTweedImg,
    icone: '✨',
    vibeDorama: 'Jantar de Gala e Família Tradicional',
    descricaoDorama:
      'Tweed clássico texturizado com fios dourados sutis e forro acetinado. Composto por casaqueto refinado e saia estruturada, exalando a estética old money de Seul e a sofisticação atemporal da alta sociedade.',
  },
  {
    id: 8,
    nome: 'Macacão Pantalona',
    nomeCompleto: 'Macacão Pantalona Seda Hongdae',
    preco: 169.9,
    categoria: 'Alta Costura',
    tamanhos: ['P', 'M', 'G'],
    imagem: macacaoImg,
    icone: '💃',
    vibeDorama: 'Estreia de Tapete Vermelho',
    descricaoDorama:
      'Linhas alongadoras em crepe de seda fluido com decote suave em V e faixa acinturada. Movimento impecável que une o estilo vanguardista de Hongdae com a exuberância da elegância feminina brasileira.',
  },
];


export const MENSAGEM_BOAS_VINDAS = {
  id: 'msg-inicial',
  autor: 'assistente',
  texto: 'Olá! Seja bem-vindo(a) à Boutique Layani. Como posso ajudar você hoje? Fique à vontade para perguntar sobre nossos produtos, preços, horário de funcionamento ou taxa de entrega.',
  dataHora: new Date().toISOString(),
};

export const SUGESTOES_PERGUNTAS = [
  'Quanto custa a camiseta?',
  'Qual o preço da calça jeans?',
  'Quanto custa o vestido?',
  'Qual o horário de funcionamento?',
  'Qual o valor da taxa de entrega?',
  'Tem calça tamanho G?',
];

export function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

