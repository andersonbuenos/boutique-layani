import React, { useRef, useEffect, useState } from 'react';
import PainelFichaCliente from './PainelFichaCliente';
import BarraAcoesAtendenteChat from './BarraAcoesAtendenteChat';
import CheckoutVendaModal from './CheckoutVendaModal';
import './ModalVerAtendimentoInovador.css';

export default function ModalVerAtendimentoInovador({
  chat,
  modo = 'ver',
  usuario,
  contagemDelay = 0,
  onFechar,
  onAssumir,
  onEnviarMensagem,
  onEncerrar,
}) {
  const [modalCheckout, setModalCheckout] = useState(false);
  const fimListaRef = useRef(null);

  useEffect(() => {
    fimListaRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.mensagens, contagemDelay]);

  if (!chat) return null;

  const ultimaMensagem = chat.mensagens[chat.mensagens.length - 1];
  const isOnline = chat.status === 'on';
  const isModoAssumir = modo === 'assumir';

  const handleVendaConcluida = (pedido) => {
    setModalCheckout(false);
    if (onEnviarMensagem) {
      onEnviarMensagem(
        `🎉 Pedido ${pedido.id} gerado e aprovado com sucesso! Total: R$ ${pedido.valorTotal}. Forma: ${pedido.formaPagamento?.toUpperCase() || 'PIX'}. Sua peça já está reservada!`
      );
    }
  };

  return (
    <div
      className="modal-inovador-backdrop"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
      role="presentation"
    >
      <div className="modal-inovador-card" role="dialog" aria-modal="true">
        {/* Header Estilo Console de Concierge de Alta Costura */}
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
                  <span>{isOnline ? 'Ao Vivo' : 'Inativo'}</span>
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
              <span>Tempo Real (0ms)</span>
            </span>

            {onAssumir && (
              <button
                type="button"
                className="btn-assumir-inovador"
                onClick={() => onAssumir(chat)}
              >
                <span>Assumir Atendimento</span>
              </button>
            )}

            <button
              type="button"
              className="checkout-btn-fechar"
              onClick={onFechar}
              aria-label="Fechar painel"
            >
              ✕
            </button>
          </div>
        </header>


        {/* Corpo com Duas Colunas: Timeline da Conversa + Painel da Cliente */}
        <div className="modal-inovador-corpo">
          <div className="coluna-chat-conversa">
            {isModoAssumir && contagemDelay > 0 && (
              <div className="banner-delay-5s" role="alert">
                <span className="spinner-mini"></span>
                <span>
                  Direcionando atendimento para {usuario?.nome || 'Atendente'}... Apresentação em{' '}
                  {contagemDelay} segundo(s).
                </span>
              </div>
            )}

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

            {isModoAssumir ? (
              <BarraAcoesAtendenteChat
                onEnviarMensagem={onEnviarMensagem}
                onAbrirCheckout={() => setModalCheckout(true)}
              />
            ) : (
              <div className="rodape-monitor-status">
                <span>
                  <strong>Última Interação:</strong> "{ultimaMensagem?.texto?.substring(0, 60)}..."
                </span>
                <span>{chat.mensagens.length} mensagens trocadas</span>
              </div>
            )}
          </div>

          <PainelFichaCliente chat={chat} />
        </div>
      </div>

      {modalCheckout && (
        <CheckoutVendaModal
          clienteNomePadrao={chat.clienteNome}
          clienteEmailPadrao={chat.clienteEmail}
          onFechar={() => setModalCheckout(false)}
          onVendaConcluida={handleVendaConcluida}
        />
      )}
    </div>
  );
}

