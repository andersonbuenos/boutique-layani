import React, { useRef, useEffect, useState } from 'react';
import PainelFichaCliente from './PainelFichaCliente';
import BarraAcoesAtendenteChat from './BarraAcoesAtendenteChat';
import CheckoutVendaModal from './CheckoutVendaModal';
import './ModalVerAtendimentoInovador.css';

export default function ModalAtendimentoAssumido({
  chat,
  usuario,
  contagemDelay = 0,
  onFechar,
  onEnviarMensagem,
  onEncerrar,
}) {
  const [modalCheckout, setModalCheckout] = useState(false);
  const fimListaRef = useRef(null);

  useEffect(() => {
    fimListaRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.mensagens, contagemDelay]);

  if (!chat) return null;

  const nomeAtendente = usuario?.nome || chat.atendenteNome || 'Camila Atendente';
  const isOnline = chat.status === 'on';

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
        {/* Tarja Superior em Destaque: Atendente Assumiu o Atendimento */}
        <div className="tarja-topo-atendente-assumiu">
          <div className="tarja-info-esquerda">
            <span className="tarja-icone-coroa" aria-hidden="true">👑</span>
            <span>
              Atendimento - Atendente <strong>{nomeAtendente}</strong> assumiu o atendimento
            </span>
          </div>
          <span className="badge-tag-humano-ativo">Atendimento Humano Ativo</span>
        </div>

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
                  <span>{isOnline ? 'CHAT AO VIVO' : 'SESSÃO INATIVA'}</span>
                </span>
              </h3>
              <p className="cliente-subtitulo">
                {chat.clienteEmail} • {chat.canal} • Atendente: <strong>{nomeAtendente}</strong>
              </p>
            </div>
          </div>

          <div className="acoes-header-inovador">
            <span className="badge-conexao-live">
              <span className="alert-dot-pulse"></span>
              <span>Conexão Simultânea (0ms)</span>
            </span>

            {onEncerrar && (
              <button
                type="button"
                className="btn-encerrar-atendimento"
                onClick={onEncerrar}
                title="Encerrar atendimento humano e fechar card"
              >
                <span aria-hidden="true">🛑</span>
                <span>Encerrar Atendimento</span>
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
            {/* Banner de Direcionamento com Delay Regressivo */}
            {contagemDelay > 0 ? (
              <div className="banner-delay-5s" role="alert">
                <span className="spinner-mini"></span>
                <span>
                  Direcionando atendimento para {nomeAtendente}... Apresentação em{' '}
                  {contagemDelay} segundo(s).
                </span>
              </div>
            ) : (
              <div className="banner-atendimento-humano-conectado">
                <span aria-hidden="true">✨</span>
                <span>
                  Atendimento assumido com sucesso! Atendente <strong>{nomeAtendente}</strong> conectado(a) em tempo real.
                </span>
              </div>
            )}

            {/* Timeline da Conversa */}
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

            {/* Barra de Ações Rápidas e Envio Simultâneo */}
            <BarraAcoesAtendenteChat
              onEnviarMensagem={onEnviarMensagem}
              onAbrirCheckout={() => setModalCheckout(true)}
            />
          </div>

          {/* Coluna Inteligente de Contexto da Cliente */}
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
