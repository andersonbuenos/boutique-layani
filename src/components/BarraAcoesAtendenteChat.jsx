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
          className="btn-acao-rapida"
          style={{ background: '#dcfce7', color: '#166534', borderColor: '#bbf7d0' }}
          onClick={onAbrirCheckout}
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
          Enviar Mensagem
        </button>
      </form>
    </div>
  );
}
