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
          <span>Concluir Venda (Checkout)</span>
        </button>
        <button
          type="button"
          className="btn-acao-rapida btn-acao-reverter"
          onClick={() =>
            setInputResposta(
              'Gostaria de liberar para você uma cortesia exclusiva de FRETE GRÁTIS para concluir seu pedido agora!'
            )
          }
        >
          <span>Oferecer Frete Cortesia</span>
        </button>
        <button
          type="button"
          className="btn-acao-rapida btn-acao-medidas"
          onClick={() =>
            setInputResposta(
              'Nossa grade oficial é: P (36-38), M (40-42) e G (44). As peças possuem corte refinado e caimento acinturado.'
            )
          }
        >
          <span>Guia de Medidas</span>
        </button>
      </div>

      <form className="form-chat-inovador" onSubmit={handleSubmit}>
        <input
          type="text"
          className="input-chat-inovador"
          value={inputResposta}
          onChange={(e) => setInputResposta(e.target.value)}
          placeholder="Digite sua mensagem em tempo real..."
        />
        <button
          type="submit"
          className="btn-enviar-inovador"
          disabled={!inputResposta.trim()}
        >
          <span>Enviar</span>
        </button>
      </form>
    </div>
  );
}


