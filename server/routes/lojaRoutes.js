import { Router } from 'express';
import { ESTOQUE, LOJA_INFO } from '../data/store.js';

export const lojaRouter = Router();

// GET /api/loja - Informações públicas de funcionamento
lojaRouter.get('/loja', (req, res) => {
  return res.json(LOJA_INFO);
});

// GET /api/produtos - Catálogo público oficial da boutique
lojaRouter.get('/produtos', (req, res) => {
  const produtosPublicos = ESTOQUE.map((item) => ({
    id: item.id,
    nome: item.nome,
    preco: item.precoVenda,
    categoria: item.categoria,
    statusDisponibilidade: item.quantidade > 0 ? 'Disponível' : 'Indisponível',
  }));

  return res.json(produtosPublicos);
});

// GET /api/produtos/:id - Detalhes de um produto
lojaRouter.get('/produtos/:id', (req, res) => {
  const id = Number(req.params.id);
  const produto = ESTOQUE.find((p) => p.id === id);

  if (!produto) {
    return res.status(404).json({ erro: 'Produto não encontrado no catálogo.' });
  }

  return res.json({
    id: produto.id,
    nome: produto.nome,
    preco: produto.precoVenda,
    categoria: produto.categoria,
    statusDisponibilidade: produto.quantidade > 0 ? 'Disponível' : 'Indisponível',
  });
});
