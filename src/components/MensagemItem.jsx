import React from 'react';

const LINK_WHATSAPP =
  'https://api.whatsapp.com/send?phone=5567991012354&text=Ol%C3%A1%2C%20preciso%20de%20algumas%20informa%C3%A7%C3%B5es%21';

export default function MensagemItem({ mensagem }) {
  const isAssistente = mensagem.autor === 'assistente';

  const horaFormatada = new Date(mensagem.dataHora).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const exibeBotaoWhatsapp =
    isAssistente &&
    (mensagem.texto.includes('continue o atendimento neste botão') ||
      mensagem.texto.includes('Não tenho essa informação no momento'));

  return (
    <li
      className={`mensagem-item ${
        isAssistente ? 'mensagem-assistente' : 'mensagem-cliente'
      }`}
    >
      <div className="mensagem-avatar" aria-hidden="true">
        {isAssistente ? '🌸' : '👤'}
      </div>
      <div className="mensagem-conteudo">
        <div className="mensagem-cabecalho">
          <span className="mensagem-autor">
            {isAssistente ? 'Atendente Layani' : 'Você'}
          </span>
          <span
            className="mensagem-hora"
            aria-label={`Enviado às ${horaFormatada}`}
          >
            {horaFormatada}
          </span>
        </div>
        <p className="mensagem-texto">{mensagem.texto}</p>

        {exibeBotaoWhatsapp && (
          <a
            href={LINK_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp-chat"
            aria-label="Continuar atendimento no WhatsApp da Boutique Layani (abre em nova aba)"
          >
            <span className="btn-whatsapp-icone" aria-hidden="true">
              📲
            </span>
            <span>Continuar no WhatsApp</span>
            <span className="btn-whatsapp-seta" aria-hidden="true">
              ↗
            </span>
          </a>
        )}
      </div>
    </li>
  );
}


