import { Router } from 'express';
import { VENDAS, ESTOQUE, LOJA_INFO } from '../data/store.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireAdmin } from '../middlewares/roleMiddleware.js';
import pool, { isMySQLOnline } from '../database/db.js';

export const vendasRouter = Router();

// GET /api/vendas - Consulta de histórico de pedidos (Exclusivo Admin - Somente GET)
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

// POST /api/vendas/checkout - Fechamento de Venda Realista (PIX, Cartão, Pagamento na Entrega)
vendasRouter.post('/checkout', async (req, res) => {
  const {
    clienteNome,
    clienteEmail,
    clienteTelefone,
    enderecoEntrega,
    itens = [],
    formaPagamento = 'pix',
    detalhesPagamento = {},
    canal = 'Chat Virtual',
    tempoFechamentoSegundos = 35,
    termoBuscaSeo = 'boutique layani moda feminina',
  } = req.body || {};

  if (!clienteNome || !itens.length) {
    return res.status(400).json({
      erro: 'Nome do cliente e ao menos 1 item são obrigatórios para fechar a venda.',
    });
  }

  // 1. Calcula totais
  const subtotal = itens.reduce(
    (acc, it) => acc + Number(it.precoUnitario) * Number(it.quantidade || 1),
    0
  );
  const taxaEntrega = LOJA_INFO.taxaEntrega || 10.0;
  const valorTotal = Number((subtotal + taxaEntrega).toFixed(2));
  const codigoPedido = `PED-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const dataCriacao = new Date().toISOString();

  // 2. Processa o Método de Pagamento com dados realistas
  let dadosCobranca = {};
  let statusPedido = 'Concluído';

  if (formaPagamento === 'pix') {
    const chavePix = '5567991012354';
    const payloadPix = `00020126580014BR.GOV.BCB.PIX0136${chavePix}520400005303986540${valorTotal.toFixed(2)}5802BR5915BOUTIQUE LAYANI6012CAMPO GRANDE62070503***6304ABCD`;
    dadosCobranca = {
      tipo: 'PIX',
      chavePix,
      pixCopiaECola: payloadPix,
      expiracaoMinutos: 15,
      instrucao: 'Escaneie o QR Code ou copie a chave PIX para confirmar instantaneamente.',
    };
  } else if (formaPagamento === 'cartao') {
    const parcelas = Number(detalhesPagamento.parcelas) || 1;
    const valorParcela = Number((valorTotal / parcelas).toFixed(2));
    const bandeira = detalhesPagamento.bandeira || 'Mastercard';
    const finalCartao = detalhesPagamento.numero
      ? detalhesPagamento.numero.slice(-4)
      : '7412';

    dadosCobranca = {
      tipo: 'Cartão de Crédito',
      bandeira,
      cartaoFinal: finalCartao,
      parcelas: `${parcelas}x de R$ ${valorParcela.toFixed(2).replace('.', ',')} sem juros`,
      codigoAutorizacao: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
      instrucao: 'Transação autorizada com sucesso pela adquirente da boutique.',
    };
  } else if (formaPagamento === 'entrega_dinheiro') {
    const trocoPara = Number(detalhesPagamento.trocoPara) || valorTotal;
    const troco = Math.max(0, Number((trocoPara - valorTotal).toFixed(2)));
    statusPedido = 'Confirmado (Pagar na Entrega)';
    dadosCobranca = {
      tipo: 'Dinheiro na Entrega',
      trocoPara,
      valorTroco: troco,
      instrucao: `O entregador levará R$ ${troco.toFixed(2).replace('.', ',')} de troco.`,
    };
  } else if (formaPagamento === 'entrega_cartao') {
    statusPedido = 'Confirmado (Pagar na Entrega)';
    dadosCobranca = {
      tipo: 'Maquininha na Entrega',
      modalidade: detalhesPagamento.modalidade || 'Débito / Crédito',
      instrucao: 'O entregador levará a maquininha para pagamento no ato da entrega.',
    };
  }

  // 3. Monta o pedido consolidado
  const novoPedido = {
    id: codigoPedido,
    data: dataCriacao,
    clienteNome,
    clienteEmail: clienteEmail || 'cliente@loja.com.br',
    clienteTelefone: clienteTelefone || '(67) 99101-2354',
    enderecoEntrega: enderecoEntrega || 'Retirada na Boutique Layani',
    canal,
    itens,
    taxaEntrega,
    subtotal: Number(subtotal.toFixed(2)),
    valorTotal,
    status: statusPedido,
    formaPagamento,
    dadosCobranca,
  };

  // Salva na memória do servidor
  VENDAS.unshift(novoPedido);

  // Baixa automática no estoque
  itens.forEach((it) => {
    const itemEstoque = ESTOQUE.find((e) => e.id === Number(it.produtoId));
    if (itemEstoque && itemEstoque.quantidade > 0) {
      itemEstoque.quantidade -= Number(it.quantidade || 1);
      if (itemEstoque.quantidade <= itemEstoque.estoqueMinimo) {
        itemEstoque.status = itemEstoque.quantidade === 0 ? 'Esgotado' : 'Estoque baixo';
      }
    }
  });

  // 4. Registra no Banco MySQL (se conectado) com log analítico do Prisma
  if (isMySQLOnline() && pool) {
    try {
      await pool.query(
        `INSERT INTO pedidos (codigo_pedido, cliente_nome, cliente_email, canal, taxa_entrega, valor_total, status)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [codigoPedido, clienteNome, clienteEmail, canal, taxaEntrega, valorTotal, statusPedido]
      );

      // Log analítico Prisma
      await pool.query(
        `INSERT INTO logs_compras_detalhadas (codigo_pedido, cliente_nome, metodo_pagamento, tempo_fechamento_segundos, canal_aquisicao, termo_busca_seo, valor_total)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [codigoPedido, clienteNome, formaPagamento, tempoFechamentoSegundos, canal, termoBuscaSeo, valorTotal]
      );
    } catch (err) {
      console.warn('[Vendas Checkout] Aviso ao gravar MySQL:', err.message);
    }
  }

  return res.status(201).json({
    sucesso: true,
    mensagem: 'Venda fechada com sucesso!',
    pedido: novoPedido,
  });
});

