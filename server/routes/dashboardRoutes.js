import { Router } from 'express';
import {
  ESTOQUE,
  VENDAS,
  VENDEDORES,
  HISTORICO_MENSAL_VENDAS,
  MOTIVOS_CANCELAMENTO,
  LOJA_INFO,
} from '../data/store.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/roleMiddleware.js';

export const dashboardRouter = Router();

// GET /api/dashboard - Visão Analítica & Estratégica (Exclusivo Admin - Somente GET)
dashboardRouter.get('/', authMiddleware, requireAdmin, (req, res) => {
  // 1. Cálculos de Vendas Gerais
  const faturamentoTotal = VENDAS.reduce((acc, v) => acc + v.valorTotal, 0);
  const totalPedidos = VENDAS.length;
  const ticketMedio = totalPedidos > 0 ? faturamentoTotal / totalPedidos : 0;
  const mesAtual = HISTORICO_MENSAL_VENDAS[HISTORICO_MENSAL_VENDAS.length - 1];

  // 2. Análise de Estoque
  const totalPecasEstoque = ESTOQUE.reduce((acc, e) => acc + e.quantidade, 0);
  const itensCriticos = ESTOQUE.filter((e) => e.quantidade <= e.estoqueMinimo);

  // 3. Alertas Críticos Imediatos (Visão de Anomalias & Risco)
  const alertasCriticos = [
    {
      tipo: 'ruptura_estoque',
      severidade: 'alta',
      titulo: 'Risco de Ruptura de Estoque Imediata',
      mensagem: `O modelo "${itensCriticos[0]?.nome || 'Vestido Fluido Midi Dorama'}" possui apenas ${itensCriticos[0]?.quantidade || 8} peças (mínimo de segurança: ${itensCriticos[0]?.estoqueMinimo || 12} un.).`,
      impacto: 'Perda potencial de vendas nas próximas 72 horas.',
      acaoRecomendada: 'Solicitar lote emergencial de reposição com fornecedor.',
    },
    {
      tipo: 'cancelamentos',
      severidade: 'alta',
      titulo: 'Alerta de Cancelamento por Falta de Informação de Tamanho',
      mensagem: `42% dos cancelamentos ocorrem porque a cliente desiste por não ver os tamanhos disponíveis no chat antes de ir ao WhatsApp.`,
      impacto: 'R$ 890,00 perdidos em pedidos cancelados no mês.',
      acaoRecomendada: 'Orientar atendentes com tabela de medidas pronta no WhatsApp.',
    },
    {
      tipo: 'meta_vendedor',
      severidade: 'media',
      titulo: 'Vendedora Beatriz Especialista Abaixo da Meta',
      mensagem: `Taxa de conversão de 48.0% e 6 cancelamentos registrados (atingimento de apenas 65% da meta mensal).`,
      impacto: 'Gargalo de conversão no canal de Chat Virtual.',
      acaoRecomendada: 'Alinhar roteiro de atendimento e tempo de resposta.',
    },
    {
      tipo: 'giro_produto',
      severidade: 'baixa',
      titulo: 'Giro Lento de Estoque da Camiseta',
      mensagem: `A Camiseta Algodão Egípcio possui 45 peças em estoque (maior volume físico), mas responde por apenas 17% da receita bruta.`,
      impacto: 'Capital imobilizado em estoque físico.',
      acaoRecomendada: 'Criar combo promocional "Compre Vestido + Leve Camiseta".',
    },
  ];

  // 4. Performance Detalhada dos Vendedores
  const vendedoresPerformance = VENDEDORES.map((v) => {
    const percentualAtingido = Math.round((v.vendasRealizadas / v.metaMensal) * 100);
    return {
      ...v,
      percentualAtingido,
      statusMeta:
        percentualAtingido >= 100
          ? 'Superada'
          : percentualAtingido >= 80
          ? 'Em rota'
          : 'Crítica',
    };
  });

  // 5. Comparativo de Roupas Mais Vendidas vs Menos Vendidas
  const rankingRoupas = [
    {
      posicao: 1,
      tipo: 'top',
      nome: 'Calça Jeans Skinny Flare',
      pecasVendidas: 44,
      faturamentoGerado: 5275.6,
      participacaoReceita: '56.4%',
      statusGiro: 'Giro Altíssimo (Carro-Chefe)',
    },
    {
      posicao: 2,
      tipo: 'top',
      nome: 'Vestido Fluido Midi Dorama',
      pecasVendidas: 27,
      faturamentoGerado: 2427.3,
      participacaoReceita: '26.0%',
      statusGiro: 'Giro Alto (Estoque Crítico)',
    },
    {
      posicao: 3,
      tipo: 'bottom',
      nome: 'Camiseta Algodão Egípcio',
      pecasVendidas: 41,
      faturamentoGerado: 1635.9,
      participacaoReceita: '17.6%',
      statusGiro: 'Giro Baixo em Relação ao Estoque',
    },
  ];

  // 6. Indicadores Estratégicos Adicionais (Prisma BI)
  const indicadoresEstrategicos = {
    faturamentoMesAtual: mesAtual.faturamento,
    crescimentoMesAnterior: '+4.6%',
    ticketMedio: Number(ticketMedio.toFixed(2)),
    taxaCancelamentoGeral: '6.5%',
    valorTotalCanceladoMes: 1900.0,
    margemLucroMedia: '52.8%',
    totalPecasEstoque,
    itensEmAlertaEstoque: itensCriticos.length,
    vendedoraTop: 'Mariana Consultora (107% da meta)',
    vendedoraAtencao: 'Beatriz Especialista (65% da meta)',
  };

  return res.json({
    kpis: {
      faturamentoBruto: Number(faturamentoTotal.toFixed(2)),
      totalPedidos,
      ticketMedio: Number(ticketMedio.toFixed(2)),
      totalPecasEstoque,
      itensEmAlertaEstoque: itensCriticos.length,
      taxaCancelamento: '6.5%',
    },
    alertasCriticos,
    indicadoresEstrategicos,
    historicoMensal: HISTORICO_MENSAL_VENDAS,
    vendedores: vendedoresPerformance,
    motivosCancelamento: MOTIVOS_CANCELAMENTO,
    rankingRoupas,
    loja: {
      nome: LOJA_INFO.nome,
      taxaEntregaPadrao: LOJA_INFO.taxaEntrega,
    },
  });
});

