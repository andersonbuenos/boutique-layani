import React from 'react';

export default function SecaoAlertasCriticos({ alertas = [] }) {
  if (!alertas.length) return null;

  return (
    <section className="secao-alertas-criticos" aria-label="Alertas críticos imediatos">
      <div className="alertas-header">
        <span className="alerta-icone-topo">🚨</span>
        <div>
          <h3>O que está crítico no momento (Ação Imediata Requerida)</h3>
          <p>Diagnóstico analítico de anomalias em estoque, vendas e atendimento:</p>
        </div>
      </div>

      <div className="alertas-cards-grid">
        {alertas.map((alerta, idx) => (
          <div key={idx} className={`alerta-card alerta-${alerta.severidade}`}>
            <div className="alerta-top">
              <span className={`alerta-tag tag-${alerta.severidade}`}>
                {alerta.severidade === 'alta' ? 'Crítico' : 'Atenção'}
              </span>
              <span className="alerta-tipo">
                {alerta.tipo.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <h4 className="alerta-titulo">{alerta.titulo}</h4>
            <p className="alerta-msg">{alerta.mensagem}</p>
            <div className="alerta-impacto">
              <strong>Impacto:</strong> {alerta.impacto}
            </div>
            <div className="alerta-acao">
              <span>💡 Recomendação Prisma:</span> {alerta.acaoRecomendada}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
