import { Router } from 'express';
import { ESTOQUE } from '../data/store.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRoles } from '../middlewares/roleMiddleware.js';

export const estoqueRouter = Router();

// GET /api/estoque - Apenas método GET. Acessível por 'admin' e 'atendente'
estoqueRouter.get(
  '/',
  authMiddleware,
  requireRoles(['admin', 'atendente']),
  (req, res) => {
    // Retorna visão enriquecida do estoque
    const inventario = ESTOQUE.map((item) => {
      const margemReais = item.precoVenda - item.custoUnitario;
      const margemPercentual = ((margemReais / item.precoVenda) * 100).toFixed(1);
      const valorTotalEstoque = item.quantidade * item.precoVenda;

      return {
        ...item,
        margemReais: Number(margemReais.toFixed(2)),
        margemPercentual: Number(margemPercentual),
        valorTotalEstoque: Number(valorTotalEstoque.toFixed(2)),
        alertaReposicao: item.quantidade <= item.estoqueMinimo,
      };
    });

    const totalPecas = ESTOQUE.reduce((acc, curr) => acc + curr.quantidade, 0);
    const totalItensCriticos = ESTOQUE.filter(
      (item) => item.quantidade <= item.estoqueMinimo
    ).length;

    return res.json({
      resumo: {
        totalPecas,
        totalModelos: ESTOQUE.length,
        itensEmAlerta: totalItensCriticos,
      },
      itens: inventario,
    });
  }
);
