import './Atendimento.css';
import React, { useState, useRef, useEffect } from 'react';
import MensagemItem from './MensagemItem';
import SugestoesPerguntas from './SugestoesPerguntas';

export default function Atendimento({
  mensagens,
  isDigitando,
  onEnviarMensagem,
  onLimparConversa,
}) {
  const [inputTexto, setInputTexto] = useState('');
  const fimMensagensRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fimMensagensRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens, isDigitando]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const textoLimpo = inputTexto.trim();
    if (!textoLimpo || isDigitando) return;

    onEnviarMensagem(textoLimpo);
    setInputTexto('');
    // Preserva foco para boa usabilidade
    inputRef.current?.focus();
  };

  const handleSugestao = (pergunta) => {
    if (isDigitando) return;
    onEnviarMensagem(pergunta);
    inputRef.current?.focus();
  };

  const handleLimpar = () => {
    onLimparConversa();
    inputRef.current?.focus();
  };

  return (
    <section className="atendimento-section" aria-labelledby="chat-titulo">
      <div className="chat-card">
        <header className="chat-header">
          <div className="chat-title-group">
            <h2 id="chat-titulo" className="chat-title">
              <span>Concierge Boutique Layani</span>
            </h2>
            <p className="chat-status">
              <span className="status-indicator" aria-hidden="true"></span>
              <span>Disponível • Consulta de catálogo e suporte</span>
            </p>
          </div>
          <button
            type="button"
            className="btn-limpar"
            onClick={handleLimpar}
            aria-label="Limpar histórico de conversa"
            title="Limpar conversa"
          >
            <span>Limpar conversa</span>
          </button>
        </header>


        <div
          className="chat-mensagens-container"
          role="log"
          aria-live="polite"
          aria-atomic="false"
          aria-busy={isDigitando}
          aria-label="Histórico de atendimento"
        >
          <ul className="chat-mensagens-lista">
            {mensagens.map((msg) => (
              <MensagemItem key={msg.id} mensagem={msg} />
            ))}

            {isDigitando && (
              <li className="mensagem-digitando" aria-label="Concierge está digitando">
                <div className="mensagem-avatar" aria-hidden="true">
                  L
                </div>

                <div className="digitando-bolha">
                  <span className="digitando-ponto"></span>
                  <span className="digitando-ponto"></span>
                  <span className="digitando-ponto"></span>
                  <span className="sr-only">Atendente digitando resposta...</span>
                </div>
              </li>
            )}
          </ul>
          <div ref={fimMensagensRef} />
        </div>

        <SugestoesPerguntas
          onSelecionarPergunta={handleSugestao}
          desabilitado={isDigitando}
        />

        <form className="chat-form" onSubmit={handleSubmit}>
          <label htmlFor="campo-mensagem" className="sr-only">
            Digite sua dúvida
          </label>
          <input
            id="campo-mensagem"
            ref={inputRef}
            type="text"
            className="chat-input"
            value={inputTexto}
            onChange={(e) => setInputTexto(e.target.value)}
            placeholder="Digite sua dúvida (ex: Quanto custa a calça jeans?)"
            autoComplete="off"
            disabled={isDigitando}
          />
          <button
            type="submit"
            className="btn-enviar"
            disabled={!inputTexto.trim() || isDigitando}
            aria-label="Enviar mensagem"
          >
            <span>Enviar</span>
            <span aria-hidden="true">↵</span>
          </button>
        </form>
      </div>
    </section>
  );
}

