import React from 'react';
import { PRODUTOS } from '../data/boutiqueData';
import ProdutoCard from './ProdutoCard';

export default function Catalogo({ onConsultarPreco, onAbrirModal }) {
  return (
    <section className="catalogo-section" aria-labelledby="catalogo-titulo">
      <div className="section-header">
        <span className="section-tag" aria-hidden="true">
          Peças Selecionadas
        </span>
        <h2 id="catalogo-titulo" className="section-title">
          Catálogo da Boutique
        </h2>
        <p className="section-description">
          Peças clássicas inspiradas em figurinos de dorama e valores oficiais fixos
        </p>
      </div>

      <div className="catalogo-grid">
        {PRODUTOS.map((produto) => (
          <ProdutoCard
            key={produto.id}
            produto={produto}
            onConsultarPreco={onConsultarPreco}
            onAbrirModal={onAbrirModal}
          />
        ))}
      </div>
    </section>
  );
}


