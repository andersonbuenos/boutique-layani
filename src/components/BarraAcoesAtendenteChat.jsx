import React, { useState } from 'react';

export default function BarraAcoesAtendenteChat({
  onEnviarMensagem,
  onAbrirCheckout,
}) {
  const [inputResposta, setInputResposta] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputResposta.trim()) return;
    onEnviarMensagem(inputResposta.trim());
    setInputResposta('');
  };

  return (
    <div className="rodape-acoes-atendente">
      <div className="acoes-rapidas-inovador">
        <button
          type="button"
          className="btn-acao-rapida btn-acao-venda"
          onClick={onAbrirCheckout}
        >
          <span>🛍️</span>
          <span>Fechar Venda (PIX / Cartão / Entrega)</span>
        </button>
        <button
          type="button"
          className="btn-acao-rapida btn-acao-reverter"
          onClick={() =>
            setInputResposta(
              'Querida cliente, não cancele! 🌸 Liberei para você um cupom exclusivo com FRETE GRÁTIS para concluir seu pedido agora!'
            )
          }
        >
          <span>🛡️</span>
          <span>Reverter Cancelamento</span>
        </button>
        <button
          type="button"
          className="btn-acao-rapida btn-acao-medidas"
          onClick={() =>
            setInputResposta(
              'Nossa tabela de medidas é: P (36-38), M (40-42) e G (44). O caimento é perfeito e acinturado!'
            )
          }
        >
          <span>📏</span>
          <span>Tabela de Medidas</span>
        </button>
      </div>

      <form className="form-chat-inovador" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input-chat-inovador"
          value={inputResposta}
          onChange={(e) => setInputResposta(e.target.value)}
          placeholder="Digite sua resposta simultânea para a cliente..."
        />
        <button
          type="submit"
          className="btn-enviar-inovador"
          disabled={!inputResposta.trim()}
        >
          <span>Enviar Mensagem</span>
          <span>➤</span>
        </button>
      </form>
    </div>
  );
}

