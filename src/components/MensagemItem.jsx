import React from 'react';

const LINK_WHATSAPP =
  'https://api.whatsapp.com/send?phone=5567991012354&text=Ol%C3%A1%2C%20preciso%20de%20algumas%20informa%C3%A7%C3%B5es%21';

/**
 * Renderiza o texto sem asteriscos, formatando negritos e marcadores com elegância
 */
function renderizarTextoFormatado(texto) {
  if (!texto) return '';

  const linhas = texto.split('\n');

  return linhas.map((linha, indexLinha) => {
    // Limpa marcadores de lista (* -> •)
    let linhaFormatada = linha.trimStart();
    if (linhaFormatada.startsWith('* ') || linhaFormatada.startsWith('- ')) {
      linhaFormatada = '• ' + linhaFormatada.slice(2);
    }

    // Se a linha tem asteriscos de negrito: **termo**
    // Divide por partes para renderizar <strong> limpo sem asteriscos
    const partes = linhaFormatada.split(/(\*\*.*?\*\*)/g);

    return (
      <React.Fragment key={indexLinha}>
        {partes.map((parte, indexParte) => {
          if (parte.startsWith('**') && parte.endsWith('**')) {
            const conteudoNegrito = parte.slice(2, -2).replace(/\*/g, '');
            return (
              <strong key={indexParte} style={{ fontWeight: 700, color: '#9d174d' }}>
                {conteudoNegrito}
              </strong>
            );
          }
          // Remove qualquer outro asterisco solto indesejado
          const textoLimpo = parte.replace(/\*/g, '');
          return <span key={indexParte}>{textoLimpo}</span>;
        })}
        {indexLinha < linhas.length - 1 && <br />}
      </React.Fragment>
    );
  });
}

export default function MensagemItem({ mensagem }) {
  const isAssistente = mensagem.autor === 'assistente';
  const isAtendente = mensagem.autor === 'atendente';

  const horaFormatada = new Date(mensagem.dataHora).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const exibeBotaoWhatsapp =
    isAssistente &&
    (mensagem.texto.includes('continue o atendimento neste botão') ||
      mensagem.texto.includes('Não tenho essa informação no momento'));

  let nomeExibicao = 'Você';
  if (isAssistente) {
    nomeExibicao = 'Assistente Virtual';
  } else if (isAtendente) {
    nomeExibicao = mensagem.autorNome || 'Atendente Layani';
  }

  return (
    <li
      className={`mensagem-item ${
        isAssistente || isAtendente ? 'mensagem-assistente' : 'mensagem-cliente'
      }`}
    >
      <div className="mensagem-avatar" aria-hidden="true">
        {isAssistente ? '🌸' : isAtendente ? '💼' : '👤'}
      </div>
      <div className="mensagem-conteudo">
        <div className="mensagem-cabecalho">
          <span className="mensagem-autor">{nomeExibicao}</span>
          <span
            className="mensagem-hora"
            aria-label={`Enviado às ${horaFormatada}`}
          >
            {horaFormatada}
          </span>
        </div>
        <div className="mensagem-texto">
          {renderizarTextoFormatado(mensagem.texto)}
        </div>

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



