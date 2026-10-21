import { Router } from 'express';
import { VENDAS } from '../data/store.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/roleMiddleware.js';

export const vendasRouter = Router();

// GET /api/vendas - Apenas método GET. Exclusivo para perfil 'admin'
vendasRouter.get('/', authMiddleware, requireAdmin, (req, res) => {
  const faturamentoTotal = VENDAS.reduce((acc, curr) => acc + curr.valorTotal, 0);

  return res.json({
    resumo: {
      totalPedidos: VENDAS.length,
      faturamentoTotal: Number(faturamentoTotal.toFixed(2)),
      ticketMedio: Number((faturamentoTotal / (VENDAS.length || 1)).toFixed(2)),
    },
    pedidos: VENDAS,
  });
});
