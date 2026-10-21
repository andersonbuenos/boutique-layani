import React from 'react';
import { LOJA } from '../data/boutiqueData';

export default function Footer() {
  return (
    <footer className="app-footer" role="contentinfo">
      <div className="footer-container">
        <p className="footer-copyright">
          © {new Date().getFullYear()} {LOJA.nome} • Moda feminina, elegância e atendimento exclusivo.
        </p>
      </div>
    </footer>
  );
}

