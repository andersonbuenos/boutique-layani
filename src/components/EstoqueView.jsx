import React, { useState, useEffect } from 'react';
import { formatarPreco } from '../data/boutiqueData';
import { buscarEstoque } from '../services/apiService';
import './EstoqueView.css';

export default function EstoqueView({ token, usuario }) {
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    async function carregarEstoque() {
      try {
        setCarregando(true);
        const data = await buscarEstoque(token);
        setDados(data);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarEstoque();
  }, [token]);


  if (carregando) {
    return (
      <div className="view-loading">
        <span className="loading-spinner"></span>
        <p>Carregando inventário de estoque seguro...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="view-erro-container">
        <h3>Acesso Restrito ao Estoque</h3>
        <p>{erro}</p>
      </div>
    );
  }

  const { resumo, itens } = dados || { resumo: {}, itens: [] };

  return (
    <div className="estoque-view-container">
      <div className="view-header">
        <div>
          <span className="view-badge">📦 Módulo Operacional (GET)</span>
          <h2 className="view-title">Controle de Estoque & Inventário</h2>
          <p className="view-subtitle">
            Visão em tempo real da disponibilidade, custos e alertas de reposição da Boutique Layani.
          </p>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <span className="kpi-icon">👗</span>
          <div>
            <span className="kpi-label">Total de Peças Físicas</span>
            <strong className="kpi-value">{resumo.totalPecas || 0} un.</strong>
          </div>
        </div>

        <div className="kpi-card">
          <span className="kpi-icon">🏷️</span>
          <div>
            <span className="kpi-label">Modelos Cadastrados</span>
            <strong className="kpi-value">{resumo.totalModelos || 0} itens</strong>
          </div>
        </div>

        <div className="kpi-card kpi-alerta">
          <span className="kpi-icon">⚠️</span>
          <div>
            <span className="kpi-label">Itens em Alerta de Estoque</span>
            <strong className="kpi-value">{resumo.itensEmAlerta || 0} modelo(s)</strong>
          </div>
        </div>
      </div>

      {/* Tabela de Estoque */}
      <div className="tabela-card">
        <div className="tabela-header">
          <h3>Inventário Detalhado</h3>
          <span className="tabela-tag">Atualizado via API REST</span>
        </div>

        <div className="tabela-scroll">
          <table className="tabela-dados">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Peça / Modelo</th>
                <th>Grade</th>
                <th>Qtd.</th>
                <th>Estoque Mín.</th>
                {usuario?.role === 'admin' && <th>Custo Unit.</th>}
                <th>Preço Venda</th>
                {usuario?.role === 'admin' && <th>Margem</th>}
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {itens.map((item) => (
                <tr key={item.id} className={item.alertaReposicao ? 'linha-alerta' : ''}>
                  <td><code>{item.sku}</code></td>
                  <td><strong>{item.nome}</strong></td>
                  <td><span className="badge-grade">{item.tamanhoPadrao}</span></td>
                  <td><strong className="qtd-destaque">{item.quantidade}</strong></td>
                  <td>{item.estoqueMinimo} un.</td>
                  {usuario?.role === 'admin' && <td>{formatarPreco(item.custoUnitario)}</td>}
                  <td><strong>{formatarPreco(item.precoVenda)}</strong></td>
                  {usuario?.role === 'admin' && (
                    <td>
                      <span className="badge-margem">
                        {item.margemPercentual}% ({formatarPreco(item.margemReais)})
                      </span>
                    </td>
                  )}
                  <td>
                    <span className={`status-pill ${item.alertaReposicao ? 'pill-baixo' : 'pill-ok'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
