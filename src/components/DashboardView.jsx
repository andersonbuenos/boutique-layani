import React, { useState, useEffect } from 'react';
import { formatarPreco } from '../data/boutiqueData';
import './DashboardView.css';

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
          throw new Error(errData.erro || 'Falha ao carregar dashboard.');
        }

        const data = await res.json();
        setDados(data);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }

    if (token) {
      carregarDashboard();
    }
  }, [token]);

  if (carregando) {
    return (
      <div className="view-loading">
        <span className="loading-spinner"></span>
        <p>Calculando indicadores executivos e analíticos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="view-erro-container">
        <h3>Acesso Restrito ao Dashboard Executivo</h3>
        <p>{erro}</p>
      </div>
    );
  }

  const { kpis, graficos } = dados || { kpis: {}, graficos: {} };

  return (
    <div className="dashboard-view-container">
      <div className="view-header">
        <div>
          <span className="view-badge">📊 Painel Estratégico (Exclusivo Admin - GET)</span>
          <h2 className="view-title">Dashboard Executivo da Boutique Layani</h2>
          <p className="view-subtitle">
            Indicadores de faturamento, volume de vendas, canais e saúde do inventário.
          </p>
        </div>

        {/* Botão de Atalho para o Swagger */}
        <a
          href={`/api-docs?token=${token}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-abrir-swagger-dash"
          title="Abrir documentação interativa OpenAPI / Swagger (somente métodos GET)"
        >
          <span aria-hidden="true">🔒</span>
          <span>Acessar Swagger API Docs (Admin) ↗</span>
        </a>
      </div>

      {/* Grid de KPIs Principais */}
      <div className="dash-kpi-grid">
        <div className="dash-kpi-card destaque-faturamento">
          <div className="kpi-top">
            <span className="kpi-tag">Receita Bruta</span>
            <span className="kpi-icone-mini">💵</span>
          </div>
          <strong className="kpi-numero">
            {formatarPreco(kpis.faturamentoBruto || 0)}
          </strong>
          <span className="kpi-meta">Acumulado do período</span>
        </div>

        <div className="dash-kpi-card">
          <div className="kpi-top">
            <span className="kpi-tag">Total de Pedidos</span>
            <span className="kpi-icone-mini">🛍️</span>
          </div>
          <strong className="kpi-numero">{kpis.totalPedidos || 0}</strong>
          <span className="kpi-meta">Vendas realizadas com sucesso</span>
        </div>

        <div className="dash-kpi-card">
          <div className="kpi-top">
            <span className="kpi-tag">Ticket Médio</span>
            <span className="kpi-icone-mini">📈</span>
          </div>
          <strong className="kpi-numero">
            {formatarPreco(kpis.ticketMedio || 0)}
          </strong>
          <span className="kpi-meta">Média por cliente</span>
        </div>

        <div className="dash-kpi-card">
          <div className="kpi-top">
            <span className="kpi-tag">Mais Vendido</span>
            <span className="kpi-icone-mini">🏆</span>
          </div>
          <strong className="kpi-numero kpi-texto-curto">
            {kpis.produtoMaisVendido || 'N/A'}
          </strong>
          <span className="kpi-meta">Líder de preferência</span>
        </div>
      </div>

      {/* Gráficos Visuais de Canais e Produtos */}
      <div className="dash-graficos-grid">
        {/* Vendas por Canal */}
        <div className="grafico-card">
          <div className="grafico-header">
            <h3>Faturamento por Canal de Atendimento</h3>
            <span className="grafico-badge">WhatsApp vs Chat vs Loja</span>
          </div>

          <div className="grafico-barras-lista">
            {graficos.vendasPorCanal?.map((c, idx) => {
              const perc = Math.round(
                (c.total / (kpis.faturamentoBruto || 1)) * 100
              );
              return (
                <div key={idx} className="barra-item">
                  <div className="barra-rotulo">
                    <span>{c.canal}</span>
                    <strong>{formatarPreco(c.total)} ({perc}%)</strong>
                  </div>
                  <div className="barra-trilho">
                    <div
                      className="barra-preenchimento"
                      style={{ width: `${perc}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ranking de Produtos */}
        <div className="grafico-card">
          <div className="grafico-header">
            <h3>Volume de Peças Vendidas por Modelo</h3>
            <span className="grafico-badge">Unidades Físicas</span>
          </div>

          <div className="ranking-lista">
            {graficos.rankingProdutos?.map((p, idx) => (
              <div key={idx} className="ranking-item">
                <span className="ranking-posicao">#{idx + 1}</span>
                <span className="ranking-nome">{p.nome}</span>
                <strong className="ranking-qtd">{p.quantidade} un.</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
