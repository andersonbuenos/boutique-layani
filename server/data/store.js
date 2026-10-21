import bcrypt from 'bcryptjs';

// Chave secreta de assinatura JWT (em ambiente real viria de process.env.JWT_SECRET)
export const JWT_SECRET = process.env.JWT_SECRET || 'boutique_layani_secret_key_2026_super_secure';

// Senhas com salt hash (bcrypt)
const salt = bcrypt.genSaltSync(10);

export const USUARIOS = [
  {
    id: 'usr-admin-1',
    nome: 'Administradora Layani',
    email: 'admin@boutiquelayani.com.br',
    senhaHash: bcrypt.hashSync('Admin@Layani2026', salt),
    role: 'admin',
    criadoEm: '2026-01-10T10:00:00.000Z',
  },
  {
    id: 'usr-atendente-1',
    nome: 'Camila Atendente',
    email: 'atendente@boutiquelayani.com.br',
    senhaHash: bcrypt.hashSync('Atendente@2026', salt),
    role: 'atendente',
    criadoEm: '2026-02-15T14:30:00.000Z',
  },
  {
    id: 'usr-cliente-1',
    nome: 'Juliana Silva',
    email: 'cliente@gmail.com',
    senhaHash: bcrypt.hashSync('Cliente@2026', salt),
    role: 'cliente',
    criadoEm: '2026-03-20T16:00:00.000Z',
  },
];

export const ESTOQUE = [
  {
    id: 1,
    sku: 'LAY-CAM-001',
    nome: 'Camiseta Algodão Egípcio',
    categoria: 'Vestuário',
    tamanhoPadrao: 'Grade P / M / G',
    quantidade: 45,
    estoqueMinimo: 15,
    custoUnitario: 18.0,
    precoVenda: 39.9,
    status: 'Em estoque',
    ultimaEntrada: '2026-10-15',
  },
  {
    id: 2,
    sku: 'LAY-CAL-002',
    nome: 'Calça Jeans Skinny Flare',
    categoria: 'Vestuário',
    tamanhoPadrao: 'Grade 36 a 44',
    quantidade: 28,
    estoqueMinimo: 10,
    custoUnitario: 55.0,
    precoVenda: 119.9,
    status: 'Em estoque',
    ultimaEntrada: '2026-10-12',
  },
  {
    id: 3,
    sku: 'LAY-VES-003',
    nome: 'Vestido Fluido Midi Dorama',
    categoria: 'Vestuário',
    tamanhoPadrao: 'Grade P / M',
    quantidade: 8,
    estoqueMinimo: 12,
    custoUnitario: 38.0,
    precoVenda: 89.9,
    status: 'Estoque baixo',
    ultimaEntrada: '2026-10-05',
  },
];

export const VENDAS = [
  {
    id: 'VEN-2026-001',
    data: '2026-10-21T14:20:00.000Z',
    clienteNome: 'Maria Eduarda',
    canal: 'WhatsApp',
    itens: [
      { produtoId: 2, nome: 'Calça Jeans Skinny Flare', quantidade: 1, precoUnitario: 119.9 },
      { produtoId: 1, nome: 'Camiseta Algodão Egípcio', quantidade: 1, precoUnitario: 39.9 },
    ],
    taxaEntrega: 10.0,
    valorTotal: 169.8,
    status: 'Concluído',
  },
  {
    id: 'VEN-2026-002',
    data: '2026-10-21T11:45:00.000Z',
    clienteNome: 'Fernanda Rocha',
    canal: 'Chat Virtual',
    itens: [
      { produtoId: 3, nome: 'Vestido Fluido Midi Dorama', quantidade: 1, precoUnitario: 89.9 },
    ],
    taxaEntrega: 10.0,
    valorTotal: 99.9,
    status: 'Concluído',
  },
  {
    id: 'VEN-2026-003',
    data: '2026-10-20T16:10:00.000Z',
    clienteNome: 'Beatriz Lima',
    canal: 'WhatsApp',
    itens: [
      { produtoId: 1, nome: 'Camiseta Algodão Egípcio', quantidade: 2, precoUnitario: 39.9 },
    ],
    taxaEntrega: 0.0,
    valorTotal: 79.8,
    status: 'Concluído',
  },
  {
    id: 'VEN-2026-004',
    data: '2026-10-20T10:30:00.000Z',
    clienteNome: 'Juliana Silva',
    canal: 'Chat Virtual',
    itens: [
      { produtoId: 2, nome: 'Calça Jeans Skinny Flare', quantidade: 1, precoUnitario: 119.9 },
    ],
    taxaEntrega: 10.0,
    valorTotal: 129.9,
    status: 'Concluído',
  },
  {
    id: 'VEN-2026-005',
    data: '2026-10-19T17:00:00.000Z',
    clienteNome: 'Carla Mendes',
    canal: 'Loja Física',
    itens: [
      { produtoId: 3, nome: 'Vestido Fluido Midi Dorama', quantidade: 2, precoUnitario: 89.9 },
      { produtoId: 1, nome: 'Camiseta Algodão Egípcio', quantidade: 1, precoUnitario: 39.9 },
    ],
    taxaEntrega: 0.0,
    valorTotal: 219.7,
    status: 'Concluído',
  },
];

export const VENDEDORES = [
  {
    id: 'vend-1',
    nome: 'Camila Atendente',
    canalPrincipal: 'WhatsApp & Chat',
    metaMensal: 3500.0,
    vendasRealizadas: 3120.0,
    pedidosFechados: 24,
    pedidosCancelados: 3,
    taxaConversao: 68.5,
    avaliacaoMedia: 4.9,
  },
  {
    id: 'vend-2',
    nome: 'Mariana Consultora',
    canalPrincipal: 'Loja Física & WhatsApp',
    metaMensal: 4000.0,
    vendasRealizadas: 4280.0,
    pedidosFechados: 31,
    pedidosCancelados: 1,
    taxaConversao: 74.2,
    avaliacaoMedia: 5.0,
  },
  {
    id: 'vend-3',
    nome: 'Beatriz Especialista',
    canalPrincipal: 'Chat Virtual',
    metaMensal: 3000.0,
    vendasRealizadas: 1950.0,
    pedidosFechados: 15,
    pedidosCancelados: 6,
    taxaConversao: 48.0,
    avaliacaoMedia: 4.5,
  },
];

export const HISTORICO_MENSAL_VENDAS = [
  { mes: 'Mai/26', faturamento: 6420.0, pecasVendidas: 76, cancelamentos: 4 },
  { mes: 'Jun/26', faturamento: 7150.0, pecasVendidas: 84, cancelamentos: 3 },
  { mes: 'Jul/26', faturamento: 8200.0, pecasVendidas: 98, cancelamentos: 5 },
  { mes: 'Ago/26', faturamento: 7890.0, pecasVendidas: 91, cancelamentos: 6 },
  { mes: 'Set/26', faturamento: 8940.0, pecasVendidas: 108, cancelamentos: 4 },
  { mes: 'Out/26', faturamento: 9350.0, pecasVendidas: 114, cancelamentos: 8 },
];

export const MOTIVOS_CANCELAMENTO = [
  { motivo: 'Dúvida de tamanho/grade não informada', percentual: 42, quantidade: 8, valorPerdido: 890.0 },
  { motivo: 'Desistência de frete ou área não atendida', percentual: 26, quantidade: 5, valorPerdido: 480.0 },
  { motivo: 'Forma de pagamento (procurou parcelamento)', percentual: 18, quantidade: 3, valorPerdido: 340.0 },
  { motivo: 'Demora no retorno humano do WhatsApp', percentual: 14, quantidade: 2, valorPerdido: 190.0 },
];


export const LOJA_INFO = {
  nome: 'Boutique Layani',
  descricao: 'Atendimento virtual e moda feminina exclusiva',
  diasFuncionamento: 'segunda a sábado',
  horarioAbertura: '8h',
  horarioFechamento: '18h',
  taxaEntrega: 10.0,
  linkWhatsapp: 'https://api.whatsapp.com/send?phone=5567991012354&text=Ol%C3%A1%2C%20preciso%20de%20algumas%20informa%C3%A7%C3%B5es%21',
};
