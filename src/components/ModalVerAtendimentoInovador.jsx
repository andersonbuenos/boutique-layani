import React, { useRef, useEffect } from 'react';
import './ModalVerAtendimentoInovador.css';

export default function ModalVerAtendimentoInovador({
  chat,
  onFechar,
  onAssumir,
}) {
  const fimListaRef = useRef(null);

  useEffect(() => {
    fimListaRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.mensagens]);

  if (!chat) return null;

  const ultimaMensagem = chat.mensagens[chat.mensagens.length - 1];
  const isOnline = chat.status === 'on';

  return (
    <div
      className="modal-inovador-backdrop"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
      role="presentation"
    >
      <div className="modal-inovador-card" role="dialog" aria-modal="true">
        {/* Header Inovador estilo Console de Concierge */}
        <header className="modal-inovador-header">
          <div className="cliente-meta-topo">
            <div className="cliente-avatar-grande" aria-hidden="true">
              {chat.clienteNome?.charAt(0) || 'C'}
            </div>
            <div className="cliente-titulos">
              <h3>
                <span>{chat.clienteNome}</span>
                <span className={`status-badge-chat ${isOnline ? 'badge-on' : 'badge-off'}`}>
                  <span className={isOnline ? 'alert-dot-pulse' : 'alert-dot-off'}></span>
                  <span>{isOnline ? 'CHAT AO VIVO' : 'SESSÃO INATIVA'}</span>
                </span>
              </h3>
              <p className="cliente-subtitulo">
                {chat.clienteEmail} • {chat.canal}
              </p>
            </div>
          </div>

          <div className="acoes-header-inovador">
            <span className="badge-conexao-live">
              <span className="alert-dot-pulse"></span>
              <span>Conexão Simultânea (0ms)</span>
            </span>

            <button
              type="button"
              className="btn-assumir-inovador"
              onClick={() => onAssumir(chat)}
            >
              <span>⚡</span>
              <span>Assumir Atendimento</span>
            </button>

            <button
              type="button"
              className="checkout-btn-fechar"
              onClick={onFechar}
              aria-label="Fechar visualização"
            >
              ✕
            </button>
          </div>
        </header>

        {/* Corpo com Duas Colunas: Timeline da Conversa + Painel da Cliente */}
        <div className="modal-inovador-corpo">
          <div className="coluna-chat-conversa">
            <div className="lista-mensagens-inovadora">
              {chat.mensagens.map((msg, i) => (
                <div key={i} className={`msg-item-modal msg-${msg.autor}`}>
                  <div className="msg-bolha-texto">{msg.texto}</div>
                  <span className="msg-meta-info">
                    {msg.autorNome} • {msg.dataHora}
                  </span>
                </div>
              ))}
              <div ref={fimListaRef} />
            </div>

            {/* Rodapé garantindo a exibição clara da ÚLTIMA INTERAÇÃO */}
            <div className="rodape-monitor-status">
              <span>
                <strong>Última Interação:</strong> "{ultimaMensagem?.texto?.substring(0, 60)}..."
              </span>
              <span>{chat.mensagens.length} mensagens trocadas</span>
            </div>
          </div>

          {/* Coluna de Contexto Inteligente da Cliente */}
          <div className="coluna-contexto-cliente">
            <div className="card-info-cliente-box">
              <h4>📋 Ficha da Cliente</h4>
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
              <h4>📊 Diagnóstico Prisma BI</h4>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
