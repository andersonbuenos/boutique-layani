import camisetaImg from '../assets/camiseta.png';
import calcaImg from '../assets/calça.png';
import vestidoImg from '../assets/vestido.png';

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
    preco: 39.9,
    categoria: 'Vestuário',
    imagem: camisetaImg,
    icone: '👕',
    vibeDorama: 'Protagonista de Comédia Romântica',
    descricaoDorama:
      'Inspirada no estilo casual e irresistível das protagonistas de k-dramas em Seul. O visual perfeito para aquele encontro despretensioso em uma cafeteria fofa com o herdeiro chaebol disfarçado. Confortável, versátil e cheia de charme natural!',
  },
  {
    id: 2,
    nome: 'Calça jeans',
    preco: 119.9,
    categoria: 'Vestuário',
    imagem: calcaImg,
    icone: '👖',
    vibeDorama: 'Estilo Urbano de Gangnam',
    descricaoDorama:
      'A clássica calça jeans com caimento impecável, digna das cenas de correria romântica sob o guarda-chuva amarelo ou do dia a dia da mocinha batalhadora que conquista todos pela sua determinação. Uma peça coringa que rouba a cena em qualquer episódio!',
  },
  {
    id: 3,
    nome: 'Vestido',
    preco: 89.9,
    categoria: 'Vestuário',
    imagem: vestidoImg,
    icone: '👗',
    vibeDorama: 'Cena em Câmera Lenta com Trilha Sonora',
    descricaoDorama:
      'Aquele look marcante do momento em que o vento sopra suavemente e a trilha sonora romântica toca ao fundo. Fluido, delicado e encantador, é perfeito para o grande baile de gala ou para aquele reencontro inesperado sob as cerejeiras em flor!',
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

