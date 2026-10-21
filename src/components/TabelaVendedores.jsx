import React from 'react';
import { formatarPreco } from '../data/boutiqueData';

export default function TabelaVendedores({ vendedores = [] }) {
  if (!vendedores.length) return null;

  return (
    <section className="tabela-card" aria-label="Tabela de vendedores">
      <div className="tabela-header">
        <h3>👩‍💼 Desempenho e Metas da Equipe de Vendas</h3>
        <span className="tabela-tag">Prisma Analytics • Auditável</span>
      </div>
      <div className="tabela-scroll">
        <table className="tabela-dados">
          <thead>
            <tr>
              <th>Vendedora</th>
              <th>Canal Atuação</th>
              <th>Meta Mensal</th>
              <th>Vendas Realizadas</th>
              <th>Atingimento</th>
              <th>Pedidos</th>
              <th>Cancelados</th>
              <th>Conversão</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {vendedores.map((v) => (
              <tr key={v.id}>
                <td><strong>{v.nome}</strong></td>
                <td><span className="badge-grade">{v.canalPrincipal}</span></td>
                <td>{formatarPreco(v.metaMensal)}</td>
                <td><strong>{formatarPreco(v.vendasRealizadas)}</strong></td>
                <td>
                  <div className="barra-atingimento-container">
                    <div
                      className={`barra-atingimento ${v.statusMeta.toLowerCase().replace(' ', '-')}`}
                      style={{ width: `${Math.min(v.percentualAtingido, 100)}%` }}
                    ></div>
                    <span>{v.percentualAtingido}%</span>
                  </div>
                </td>
                <td>{v.pedidosFechados}</td>
                <td>
                  <span className={v.pedidosCancelados > 3 ? 'texto-alerta' : ''}>
                    {v.pedidosCancelados}
                  </span>
                </td>
                <td><strong>{v.taxaConversao}%</strong></td>
                <td>
                  <span
                    className={`status-pill ${
                      v.statusMeta === 'Superada'
                        ? 'pill-ok'
                        : v.statusMeta === 'Em rota'
                        ? 'pill-baixo'
                        : 'pill-critica'
                    }`}
                  >
                    {v.statusMeta}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
