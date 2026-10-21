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

export const LOJA_INFO = {
  nome: 'Boutique Layani',
  descricao: 'Atendimento virtual e moda feminina exclusiva',
  diasFuncionamento: 'segunda a sábado',
  horarioAbertura: '8h',
  horarioFechamento: '18h',
  taxaEntrega: 10.0,
  linkWhatsapp: 'https://api.whatsapp.com/send?phone=5567991012354&text=Ol%C3%A1%2C%20preciso%20de%20algumas%20informa%C3%A7%C3%B5es%21',
};
