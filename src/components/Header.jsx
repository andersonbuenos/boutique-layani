import React from 'react';
import { LOJA } from '../data/boutiqueData';

export default function Header() {
  return (
    <header className="app-header" role="banner">
      <div className="header-container">
        <div className="brand">
          <div className="brand-logo" aria-hidden="true">
            🌸
          </div>
          <div>
            <h1 className="brand-title">{LOJA.nome}</h1>
            <p className="brand-subtitle">{LOJA.descricao}</p>
          </div>
        </div>
        <div
          className="store-badge"
          aria-label={`Funcionamento: ${LOJA.diasFuncionamento}, das ${LOJA.horarioAbertura} às ${LOJA.horarioFechamento}`}
        >
          <span className="status-dot" aria-hidden="true"></span>
          <span>
            {LOJA.diasFuncionamento}: {LOJA.horarioAbertura} às {LOJA.horarioFechamento}
          </span>
        </div>
      </div>
    </header>
  );
}

