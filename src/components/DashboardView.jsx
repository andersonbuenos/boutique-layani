import React, { useState, useEffect } from 'react';
import { formatarPreco } from '../data/boutiqueData';
import SecaoAlertasCriticos from './SecaoAlertasCriticos';
import AmChartHistorico from './AmChartHistorico';
import AmChartsMulti from './AmChartsMulti';
import TabelaVendedores from './TabelaVendedores';
import './DashboardView.css';
import './GraficosAmCharts.css';

export default function DashboardView({ token }) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarDashboard() {
      try {
        setCarregando(true);
        const res = await fetch('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.erro || 'Falha ao carregar dashboard analítico.');
        }

        const data = await res.json();
        setDados(data);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }

    if (token) carregarDashboard();
  }, [token]);

  if (carregando) {
    return (
      <div className="view-loading">
        <span className="loading-spinner"></span>
        <p>Prisma BI • Calculando indicadores estratégicos e gráficos amCharts 5...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="view-erro-container">
        <h3>Acesso Restrito ao Painel Executivo</h3>
        <p>{erro}</p>
      </div>
    );
  }

  const {
    kpis,
    alertasCriticos = [],
    indicadoresEstrategicos = {},
    historicoMensal = [],
    vendedores = [],
    motivosCancelamento = [],
    rankingRoupas = [],
  } = dados || {};

  return (
    <div className="dashboard-view-container">
      {/* 1. Header Estratégico com Link Swagger */}
      <div className="view-header">
        <div>
          <span className="view-badge">📊 Prisma BI & Analytics (Visão Admin)</span>
          <h2 className="view-title">Painel Executivo Estratégico</h2>
          <p className="view-subtitle">
            Indicadores críticos de vendas, metas da equipe, cancelamentos e gráficos amCharts 5.
          </p>
        </div>

        <a
          href={`/api-docs?token=${token}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-abrir-swagger-dash"
          title="Documentação interativa OpenAPI/Swagger"
        >
          <span aria-hidden="true">🔒</span>
          <span>Acessar Swagger API Docs (Admin) ↗</span>
        </a>
      </div>

      {/* 2. O QUE ESTÁ CRÍTICO DE CARA */}
      <SecaoAlertasCriticos alertas={alertasCriticos} />

      {/* 3. VISÃO DE KPIS EXECUTIVOS */}
      <section className="secao-kpis" aria-label="Indicadores chaves">
        <div className="dash-kpi-grid">
          <div className="dash-kpi-card destaque-faturamento">
            <div className="kpi-top">
              <span className="kpi-tag">Faturamento Mês</span>
              <span className="kpi-icone-mini">💵</span>
            </div>
            <strong className="kpi-numero">
              {formatarPreco(indicadoresEstrategicos.faturamentoMesAtual || kpis.faturamentoBruto || 0)}
            </strong>
            <span className="kpi-meta positivo">
              Crescimento: {indicadoresEstrategicos.crescimentoMesAnterior || '+4.6%'}
            </span>
          </div>

          <div className="dash-kpi-card">
            <div className="kpi-top">
              <span className="kpi-tag">Ticket Médio</span>
              <span className="kpi-icone-mini">🛍️</span>
            </div>
            <strong className="kpi-numero">
              {formatarPreco(indicadoresEstrategicos.ticketMedio || kpis.ticketMedio || 0)}
            </strong>
            <span className="kpi-meta">Média por pedido</span>
          </div>

          <div className="dash-kpi-card alerta-borda">
            <div className="kpi-top">
              <span className="kpi-tag">Taxa de Cancelamento</span>
              <span className="kpi-icone-mini">⚠️</span>
            </div>
            <strong className="kpi-numero valor-alerta">
              {indicadoresEstrategicos.taxaCancelamentoGeral || '6.5%'}
            </strong>
            <span className="kpi-meta negativo">
              R$ {indicadoresEstrategicos.valorTotalCanceladoMes || '1.900,00'} perdidos
            </span>
          </div>

          <div className="dash-kpi-card">
            <div className="kpi-top">
              <span className="kpi-tag">Margem Média Líquida</span>
              <span className="kpi-icone-mini">📈</span>
            </div>
            <strong className="kpi-numero">{indicadoresEstrategicos.margemLucroMedia || '52.8%'}</strong>
            <span className="kpi-meta positivo">Alta rentabilidade</span>
          </div>

          <div className="dash-kpi-card">
            <div className="kpi-top">
              <span className="kpi-tag">Estoque Físico</span>
              <span className="kpi-icone-mini">👗</span>
            </div>
            <strong className="kpi-numero">{kpis.totalPecasEstoque || 0} un.</strong>
            <span className="kpi-meta alerta">
              {kpis.itensEmAlertaEstoque || 1} modelo em risco de ruptura
            </span>
          </div>
        </div>
      </section>

      {/* 4. GRÁFICO DE LINHAS AMCHARTS 5: HISTÓRICO MENSAL */}
      <AmChartHistorico dados={historicoMensal} />

      {/* 5. DEMAIS GRÁFICOS AMCHARTS 5: VENDEDORES, CANCELAMENTOS, RANKING ROUPAS */}
      <AmChartsMulti
        vendedores={vendedores}
        motivosCancelamento={motivosCancelamento}
        rankingRoupas={rankingRoupas}
      />

      {/* 6. TABELA DE VENDEDORES & DESEMPENHO */}
      <TabelaVendedores vendedores={vendedores} />
    </div>
  );
}

