import React, { useState, useEffect } from 'react';
import { formatarPreco } from '../data/boutiqueData';
import { buscarVendas } from '../services/apiService';
import './VendasView.css';

export default function VendasView({ token }) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarVendas() {
      try {
        setCarregando(true);
        const data = await buscarVendas(token);
        setDados(data);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarVendas();
  }, [token]);


  if (carregando) {
    return (
      <div className="view-loading">
        <span className="loading-spinner"></span>
        <p>Carregando histórico de vendas e pedidos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="view-erro-container">
        <h3>Acesso Restrito ao Painel de Vendas</h3>
        <p>{erro}</p>
      </div>
    );
  }

  const { resumo, pedidos } = dados || { resumo: {}, pedidos: [] };

  return (
    <div className="vendas-view-container">
      <div className="view-header">
        <div>
          <span className="view-badge">💰 Módulo de Vendas (Exclusivo Admin - GET)</span>
          <h2 className="view-title">Histórico de Pedidos & Faturamento</h2>
          <p className="view-subtitle">
            Acompanhamento dos pedidos realizados via Chat Virtual, WhatsApp e Loja Física.
          </p>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-icon">💵</span>
          <div>
            <span className="kpi-label">Faturamento Total</span>
            <strong className="kpi-value">{formatarPreco(resumo.faturamentoTotal || 0)}</strong>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">🛍️</span>
          <div>
            <span className="kpi-label">Pedidos Concluídos</span>
            <strong className="kpi-value">{resumo.totalPedidos || 0} vendas</strong>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">📈</span>
          <div>
            <span className="kpi-label">Ticket Médio por Venda</span>
            <strong className="kpi-value">{formatarPreco(resumo.ticketMedio || 0)}</strong>
          </div>
        </div>
      </div>

      {/* Tabela de Pedidos */}
      <div className="tabela-card">
        <div className="tabela-header">
          <h3>Relação de Pedidos Recentes</h3>
          <span className="tabela-tag">Somente Método GET</span>
        </div>

        <div className="tabela-scroll">
          <table className="tabela-dados">
            <thead>
              <tr>
                <th>Código</th>
                <th>Data / Hora</th>
                <th>Cliente</th>
                <th>Canal</th>
                <th>Itens do Pedido</th>
                <th>Frete</th>
                <th>Valor Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((p) => {
                const dataFormatada = new Date(p.data).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <tr key={p.id}>
                    <td><code>{p.id}</code></td>
                    <td>{dataFormatada}</td>
                    <td><strong>{p.clienteNome}</strong></td>
                    <td>
                      <span className={`canal-badge canal-${p.canal.toLowerCase().replace(' ', '-')}`}>
                        {p.canal}
                      </span>
                    </td>
                    <td>
                      <ul className="itens-lista-compacta">
                        {p.itens.map((it, idx) => (
                          <li key={idx}>
                            {it.quantidade}x {it.nome} ({formatarPreco(it.precoUnitario)})
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>{formatarPreco(p.taxaEntrega)}</td>
                    <td><strong className="valor-destaque">{formatarPreco(p.valorTotal)}</strong></td>
                    <td><span className="status-pill pill-ok">{p.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
