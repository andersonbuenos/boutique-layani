import React from 'react';
import { formatarPreco } from '../data/boutiqueData';

export default function ProdutoCard({ produto, onConsultarPreco, onAbrirModal }) {
  // Separa o valor numérico para uma apresentação tipográfica elegante
  const valorFormatado = produto.preco.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const handleClickImagem = () => {
    if (onAbrirModal) {
      onAbrirModal(produto);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClickImagem();
    }
  };

  return (
    <article className="produto-card" aria-label={`Produto: ${produto.nome}`}>
      <span className="produto-tag-destaque" aria-hidden="true">
        Peça Oficial
      </span>

      <div
        className="produto-imagem-container"
        role="button"
        tabIndex="0"
        onClick={handleClickImagem}
        onKeyDown={handleKeyDown}
        aria-label={`Foto de ${produto.nome}. Passe o mouse para ver o look completo ou clique para abrir detalhes em tela cheia.`}
        title="Passe o mouse para ver corpo inteiro ou clique para expandir"
      >
        {produto.imagem ? (
          <img
            src={produto.imagem}
            alt={`Foto da peça ${produto.nome}`}
            className="produto-imagem"
            loading="lazy"
          />
        ) : (
          <div className="produto-icone" aria-hidden="true">
            {produto.icone}
          </div>
        )}

        <div className="indicador-zoom" aria-hidden="true">
          <span className="indicador-zoom-icone">🔍</span>
          <span className="indicador-zoom-texto">Clique para expandir</span>
        </div>
      </div>

      <div className="produto-info">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
          <span className="produto-categoria">{produto.categoria}</span>
          {produto.vibeDorama && (
            <span style={{ fontSize: '0.72rem', color: '#be185d', fontWeight: 700, background: '#fdf2f8', padding: '0.15rem 0.5rem', borderRadius: '12px' }}>
              ✨ {produto.vibeDorama.split('&')[0].trim()}
            </span>
          )}
        </div>
        <h3 className="produto-nome">{produto.nomeCompleto || produto.nome}</h3>

        <div className="produto-preco-bloco">
          <span className="preco-rotulo">Valor fixo</span>
          <div
            className="preco-container"
            aria-label={`Preço: ${formatarPreco(produto.preco)}`}
          >
            <span className="preco-moeda" aria-hidden="true">
              R$
            </span>
            <span className="preco-valor" aria-hidden="true">
              {valorFormatado}
            </span>
          </div>
        </div>
      </div>

      <button
        type="button"
        className="btn-consultar"
        onClick={() => onConsultarPreco(produto.nome)}
        aria-label={`Consultar detalhes e preço de ${produto.nome} no chat`}
      >
        <span aria-hidden="true">💬</span>
        <span>Perguntar no chat</span>
      </button>
    </article>
  );
}




