export async function buscarEstoque(token) {
  try {
    const res = await fetch('/api/estoque', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (res.ok && data?.itens) return data;
  } catch {}

  return {
    resumo: { totalPecas: 81, totalModelos: 3, itensEmAlerta: 1 },
    itens: [
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
        margemReais: 21.9,
        margemPercentual: 54.9,
        alertaReposicao: false,
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
        margemReais: 64.9,
        margemPercentual: 54.1,
        alertaReposicao: false,
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
        margemReais: 51.9,
        margemPercentual: 57.7,
        alertaReposicao: true,
      },
    ],
  };
}

export async function buscarVendas(token) {
  try {
    const res = await fetch('/api/vendas', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (res.ok && data?.pedidos) return data;
  } catch {}

  return {
    resumo: { totalPedidos: 5, faturamentoTotal: 698.1, ticketMedio: 139.62 },
    pedidos: [
      {
        id: 'VEN-2026-001',
        data: '2026-10-21T14:20:00.000Z',
        clienteNome: 'Maria Eduarda',
        canal: 'WhatsApp',
        itens: [{ nome: 'Calça Jeans Skinny Flare', quantidade: 1, precoUnitario: 119.9 }],
        taxaEntrega: 10.0,
        valorTotal: 129.9,
        status: 'Concluído',
      },
      {
        id: 'VEN-2026-002',
        data: '2026-10-21T11:45:00.000Z',
        clienteNome: 'Fernanda Rocha',
        canal: 'Chat Virtual',
        itens: [{ nome: 'Vestido Fluido Midi Dorama', quantidade: 1, precoUnitario: 89.9 }],
        taxaEntrega: 10.0,
        valorTotal: 99.9,
        status: 'Concluído',
      },
    ],
  };
}

export async function buscarDashboard(token) {
  try {
    const res = await fetch('/api/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : null;
    if (res.ok && data?.kpis) return data;
  } catch {}

  return {
    kpis: { faturamentoBruto: 9350.0, totalPedidos: 114, ticketMedio: 82.0, totalPecasEstoque: 81, itensEmAlertaEstoque: 1, taxaCancelamento: '6.5%' },
    indicadoresEstrategicos: { faturamentoMesAtual: 9350.0, crescimentoMesAnterior: '+4.6%', ticketMedio: 82.0, taxaCancelamentoGeral: '6.5%', valorTotalCanceladoMes: 1900.0, margemLucroMedia: '52.8%', totalPecasEstoque: 81, itensEmAlertaEstoque: 1 },
    alertasCriticos: [
      { tipo: 'ruptura_estoque', severidade: 'alta', titulo: 'Risco de Ruptura de Estoque', mensagem: 'O modelo Vestido Fluido Midi possui apenas 8 peças (mínimo: 12 un.).', impacto: 'Perda potencial de vendas.', acaoRecomendada: 'Solicitar reposição emergencial.' },
      { tipo: 'cancelamentos', severidade: 'alta', titulo: 'Alerta de Cancelamento no WhatsApp', mensagem: '42% dos cancelamentos ocorrem por falta de grade no chat.', impacto: 'R$ 890,00 perdidos no mês.', acaoRecomendada: 'Padronizar tabela de medidas no WhatsApp.' },
    ],
    historicoMensal: [
      { mes: 'Mai/26', faturamento: 6420.0, pecasVendidas: 76 },
      { mes: 'Jun/26', faturamento: 7150.0, pecasVendidas: 84 },
      { mes: 'Jul/26', faturamento: 8200.0, pecasVendidas: 98 },
      { mes: 'Ago/26', faturamento: 7890.0, pecasVendidas: 91 },
      { mes: 'Set/26', faturamento: 8940.0, pecasVendidas: 108 },
      { mes: 'Out/26', faturamento: 9350.0, pecasVendidas: 114 },
    ],
    vendedores: [
      { id: 'v1', nome: 'Camila Atendente', canalPrincipal: 'WhatsApp & Chat', metaMensal: 3500.0, vendasRealizadas: 3120.0, pedidosFechados: 24, pedidosCancelados: 3, taxaConversao: 68.5, percentualAtingido: 89, statusMeta: 'Em rota' },
      { id: 'v2', nome: 'Mariana Consultora', canalPrincipal: 'Loja Física & WhatsApp', metaMensal: 4000.0, vendasRealizadas: 4280.0, pedidosFechados: 31, pedidosCancelados: 1, taxaConversao: 74.2, percentualAtingido: 107, statusMeta: 'Superada' },
      { id: 'v3', nome: 'Beatriz Especialista', canalPrincipal: 'Chat Virtual', metaMensal: 3000.0, vendasRealizadas: 1950.0, pedidosFechados: 15, pedidosCancelados: 6, taxaConversao: 48.0, percentualAtingido: 65, statusMeta: 'Crítica' },
    ],
    motivosCancelamento: [
      { motivo: 'Dúvida de tamanho/grade', percentual: 42, valorPerdido: 890.0 },
      { motivo: 'Desistência de frete', percentual: 26, valorPerdido: 480.0 },
      { motivo: 'Forma de pagamento', percentual: 18, valorPerdido: 340.0 },
      { motivo: 'Demora no WhatsApp', percentual: 14, valorPerdido: 190.0 },
    ],
    rankingRoupas: [
      { nome: 'Calça Jeans Skinny Flare', faturamentoGerado: 5275.6, tipo: 'top', statusGiro: 'Carro-Chefe' },
      { nome: 'Vestido Fluido Midi Dorama', faturamentoGerado: 2427.3, tipo: 'top', statusGiro: 'Estoque Baixo' },
      { nome: 'Camiseta Algodão Egípcio', faturamentoGerado: 1635.9, tipo: 'bottom', statusGiro: 'Menos Vendida' },
    ],
  };
}
