import React from 'react';

export default function PainelFichaCliente({ chat }) {
  if (!chat) return null;

  return (
    <div className="coluna-contexto-cliente">
      <div className="card-info-cliente-box">
        <h4>Ficha da Cliente</h4>
        <div className="info-item-linha">
          <span>Cliente:</span>
          <strong>{chat.clienteNome}</strong>
        </div>
        <div className="info-item-linha">
          <span>E-mail:</span>
          <strong>{chat.clienteEmail}</strong>
        </div>
        <div className="info-item-linha">
          <span>Canal:</span>
          <strong>{chat.canal}</strong>
        </div>
        <div className="info-item-linha">
          <span>Atendente:</span>
          <strong>{chat.atendenteNome || 'Assistente Virtual'}</strong>
        </div>
      </div>

      <div className="card-info-cliente-box">
        <h4>Diagnóstico de Atendimento</h4>
        <div className="info-item-linha">
          <span>Intenção Atual:</span>
          <strong style={{ color: 'var(--color-primary)' }}>Consulta & Compra</strong>
        </div>
        <div className="info-item-linha">
          <span>Propensão Compra:</span>
          <strong style={{ color: '#15803d' }}>Alta (85%)</strong>
        </div>
        <div className="info-item-linha">
          <span>Ticket Potencial:</span>
          <strong>R$ 129,90</strong>
        </div>
        <div className="info-item-linha">
          <span>Canal Preferencial:</span>
          <strong>Chat Virtual da Loja</strong>
        </div>
      </div>
    </div>
  );
}

