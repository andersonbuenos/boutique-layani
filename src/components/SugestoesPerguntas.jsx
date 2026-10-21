import React from 'react';
import { SUGESTOES_PERGUNTAS } from '../data/boutiqueData';

export default function SugestoesPerguntas({ onSelecionarPergunta, desabilitado }) {
  return (
    <div className="sugestoes-container" aria-label="Perguntas rápidas sugeridas">
      <div className="sugestoes-cabecalho">
        <span className="sugestoes-rotulo">
          <span aria-hidden="true">💡</span>
          <span>Dúvidas Frequentes Rápidas</span>
        </span>
      </div>
      <div className="sugestoes-lista" role="group" aria-label="Opções de perguntas">
        {SUGESTOES_PERGUNTAS.map((sugestao, index) => (
          <button
            key={index}
            type="button"
            className="btn-sugestao"
            onClick={() => onSelecionarPergunta(sugestao)}
            disabled={desabilitado}
          >
            {sugestao}
          </button>
        ))}
      </div>
    </div>
  );
}

