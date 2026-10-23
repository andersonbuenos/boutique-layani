import React from 'react';

export default function CardSessaoChat({
  sessao,
  onVerAtendimento,
  onAssumirAtendimento,
}) {
  const isOnline = sessao.status === 'on';
  const isHumano = sessao.atendimentoStatus === 'humano';
  const isDirecionando = sessao.atendimentoStatus === 'direcionando';

  return (
    <article
      className={`chat-card-sessao ${isOnline ? 'sessao-on' : 'sessao-off'} ${isHumano ? 'sessao-humano' : ''}`}
    >
      <div className="sessao-header">
        <div className="sessao-cliente-info">
          <div className="sessao-avatar" aria-hidden="true">
            {sessao.clienteNome?.charAt(0) || 'C'}
          </div>
          <div>
            <h3 className="sessao-nome">{sessao.clienteNome}</h3>
            <span className="sessao-canal">{sessao.canal}</span>
          </div>
        </div>

        <div className="sessao-status-box">
          <span
            className={`status-badge-chat ${
              isDirecionando
                ? 'badge-direcionando'
                : isHumano
                ? 'badge-humano'
                : isOnline
                ? 'badge-on'
                : 'badge-off'
            }`}
          >
            <span
              className={isOnline ? 'alert-dot-pulse' : 'alert-dot-off'}
              aria-hidden="true"
            ></span>
            <span>
              {isDirecionando
                ? 'Conectando'
                : isHumano
                ? `Com ${sessao.atendenteNome || 'Atendente'}`
                : isOnline
                ? 'Online'
                : 'Inativo'}
            </span>
          </span>
        </div>
      </div>

      <div className="sessao-previa">
        <span className="previa-rotulo">
          <span>Última Interação</span>
          <span>{sessao.mensagens.length} msgs</span>
        </span>
        <p className="previa-texto">"{sessao.ultimaMensagem || 'Sem mensagens'}"</p>
      </div>

      <div className="sessao-atendente-tag">
        <span>
          Responsável: <strong>{sessao.atendenteNome || 'Assistente Virtual'}</strong>
        </span>
      </div>

      <div className="sessao-botoes-acoes">
        <button
          type="button"
          className="btn-ver-atendimento"
          onClick={() => onVerAtendimento(sessao)}
        >
          <span>Ver Atendimento</span>
        </button>

        <button
          type="button"
          className={`btn-assumir-atendimento ${isHumano ? 'ja-assumido' : ''}`}
          onClick={() => onAssumirAtendimento(sessao)}
        >
          <span>{isHumano ? 'Abrir Conversa' : 'Assumir Atendimento'}</span>
        </button>
      </div>
    </article>
  );
}

