import React, { useRef, useEffect, useState } from 'react';
import CheckoutVendaModal from './CheckoutVendaModal';

export default function ModalAtendimentoGaveta({
  chat,
  modo,
  contagemDelay,
  usuario,
  onFechar,
  onEnviarMensagem,
  onEncerrar,
}) {
  const [inputResposta, setInputResposta] = useState('');
  const [modalCheckout, setModalCheckout] = useState(false);
  const fimChatRef = useRef(null);

  useEffect(() => {
    fimChatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.mensagens, contagemDelay]);

  if (!chat) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputResposta.trim()) return;
    onEnviarMensagem(inputResposta.trim());
    setInputResposta('');
  };

  const handleVendaConcluida = (pedido) => {
    setModalCheckout(false);
    onEnviarMensagem(
      `🎉 Pedido ${pedido.id} gerado e aprovado com sucesso! Total: R$ ${pedido.valorTotal}. Forma: ${pedido.formaPagamento?.toUpperCase() || 'PIX'}. Sua peça já está reservada!`
    );
  };

  return (
    <div
      className="modal-chat-atendente"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
      role="presentation"
    >
      <div className="modal-chat-caixa" role="dialog" aria-modal="true">
        <header className="chat-modal-topo">
          <div className="chat-modal-cliente-detalhe">
            <div className="sessao-avatar" aria-hidden="true">👤</div>
            <div>
              <h3 className="sessao-nome">{chat.clienteNome}</h3>
              <span className="sessao-canal">
                Status: {chat.status.toUpperCase()} • Atendente: {chat.atendenteNome || 'Especialista'}
              </span>
            </div>
          </div>

          <div className="chat-modal-acoes-topo">
            {chat.atendimentoStatus === 'humano' && (
              <button
                type="button"
                className="btn-encerrar-atendimento"
                onClick={onEncerrar}
                title="Encerrar atendimento e fechar card"
              >
                <span aria-hidden="true">🛑</span>
                <span>Encerrar Atendimento</span>
              </button>
            )}

            <button
              type="button"
              className="btn-fechar-gaveta"
              onClick={onFechar}
              aria-label="Fechar painel"
            >
              ✕
            </button>
          </div>
        </header>

        {contagemDelay > 0 && (
          <div className="banner-delay-5s" role="alert">
            <span className="spinner-mini"></span>
            <span>
              Direcionando atendimento para {usuario?.nome || 'Atendente'}... Apresentação em{' '}
              {contagemDelay} segundo(s).
            </span>
          </div>
        )}

        <div className="chat-modal-mensagens">
          {chat.mensagens.map((msg, i) => (
            <div key={i} className={`msg-item-modal msg-${msg.autor}`}>
              <div className="msg-bolha-texto">{msg.texto}</div>
              <span className="msg-meta-info">
                {msg.autorNome} • {msg.dataHora}
              </span>
            </div>
          ))}
          <div ref={fimChatRef} />
        </div>

        {modo === 'assumir' && chat.atendimentoStatus === 'humano' && (
          <>
            <div className="acoes-rapidas-atendente">
              <button
                type="button"
                className="btn-acao-rapida"
                style={{ background: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }}
                onClick={() => setModalCheckout(true)}
              >
                🛍️ Fechar Venda (PIX / Cartão / Entrega)
              </button>
              <button
                type="button"
                className="btn-acao-rapida"
                onClick={() =>
                  setInputResposta(
                    'Querida cliente, não cancele! 🌸 Liberei para você um cupom exclusivo com FRETE GRÁTIS para concluir seu pedido agora!'
                  )
                }
              >
                🛡️ Reverter Cancelamento
              </button>
              <button
                type="button"
                className="btn-acao-rapida"
                onClick={() =>
                  setInputResposta(
                    'Nossa tabela de medidas é: P (36-38), M (40-42) e G (44). O caimento é perfeito e acinturado!'
                  )
                }
              >
                📏 Tabela de Medidas
              </button>
            </div>

            <form className="form-resposta-atendente" onSubmit={handleSubmit}>
              <input
                type="text"
                className="input-resposta-atendente"
                value={inputResposta}
                onChange={(e) => setInputResposta(e.target.value)}
                placeholder="Digite sua resposta simultânea para a cliente..."
              />
              <button
                type="submit"
                className="btn-enviar-atendente"
                disabled={!inputResposta.trim()}
              >
                Enviar Mensagem
              </button>
            </form>
          </>
        )}
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

