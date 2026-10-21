import { Router } from 'express';
import { ESTOQUE, VENDAS, LOJA_INFO } from '../data/store.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/roleMiddleware.js';

export const dashboardRouter = Router();

// GET /api/dashboard - Apenas método GET. Exclusivo para perfil 'admin'
dashboardRouter.get('/', authMiddleware, requireAdmin, (req, res) => {
  // Faturamento e volume
  const faturamentoTotal = VENDAS.reduce((acc, v) => acc + v.valorTotal, 0);
  const totalPedidos = VENDAS.length;
  const ticketMedio = totalPedidos > 0 ? faturamentoTotal / totalPedidos : 0;

  // Estoque
  const totalPecasEstoque = ESTOQUE.reduce((acc, e) => acc + e.quantidade, 0);
  const itensCriticos = ESTOQUE.filter((e) => e.quantidade <= e.estoqueMinimo);

  // Vendas por canal
  const porCanal = {};
  VENDAS.forEach((v) => {
    porCanal[v.canal] = (porCanal[v.canal] || 0) + v.valorTotal;
  });

  // Peças vendidas por produto
  const vendasPorProduto = {};
  VENDAS.forEach((v) => {
    v.itens.forEach((item) => {
      vendasPorProduto[item.nome] =
        (vendasPorProduto[item.nome] || 0) + item.quantidade;
    });
  });

  // Campeão de vendas
  let produtoMaisVendido = 'N/A';
  let maiorQtd = 0;
  Object.entries(vendasPorProduto).forEach(([nome, qtd]) => {
    if (qtd > maiorQtd) {
      maiorQtd = qtd;
      produtoMaisVendido = nome;
    }
  });

  return res.json({
    kpis: {
      faturamentoBruto: Number(faturamentoTotal.toFixed(2)),
      totalPedidos,
      ticketMedio: Number(ticketMedio.toFixed(2)),
      totalPecasEstoque,
      itensEmAlertaEstoque: itensCriticos.length,
      produtoMaisVendido: `${produtoMaisVendido} (${maiorQtd} un.)`,
    },
    graficos: {
      vendasPorCanal: Object.entries(porCanal).map(([canal, total]) => ({
        canal,
        total: Number(total.toFixed(2)),
      })),
      rankingProdutos: Object.entries(vendasPorProduto).map(([nome, quantidade]) => ({
        nome,
        quantidade,
      })),
    },
    loja: {
      nome: LOJA_INFO.nome,
      taxaEntregaPadrao: LOJA_INFO.taxaEntrega,
    },
  });
});
