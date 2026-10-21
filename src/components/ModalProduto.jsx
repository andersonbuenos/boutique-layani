import React, { useEffect, useRef } from 'react';
import { formatarPreco } from '../data/boutiqueData';
import './ModalProduto.css';

export default function ModalProduto({ produto, onFechar, onConsultarNoChat }) {
  const modalRef = useRef(null);
  const fecharBtnRef = useRef(null);
  const elementoAnteriorRef = useRef(null);

  useEffect(() => {
    // Guarda o elemento que tinha o foco antes de abrir o modal
    elementoAnteriorRef.current = document.activeElement;

    // Trava a rolagem do body
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Foca no botão de fechar para acessibilidade imediata
    fecharBtnRef.current?.focus();

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onFechar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = overflowOriginal;
      window.removeEventListener('keydown', handleKeyDown);
      // Restaura o foco para o botão anterior
      if (elementoAnteriorRef.current && elementoAnteriorRef.current.focus) {
        elementoAnteriorRef.current.focus();
      }
    };
  }, [onFechar]);

  if (!produto) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onFechar();
    }
  };

  const handleConsultar = () => {
    onFechar();
    onConsultarNoChat(produto.nome);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="modal-card"
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-titulo"
        aria-describedby="modal-dorama-desc"
      >
        <button
          type="button"
          className="modal-btn-fechar"
          ref={fecharBtnRef}
          onClick={onFechar}
          aria-label="Fechar detalhes da peça"
          title="Fechar janela (Esc)"
        >
          ✕
        </button>

        <div className="modal-imagem-secao">
          {produto.imagem ? (
            <img
              src={produto.imagem}
              alt={`Foto expandida de corpo inteiro da peça ${produto.nome}`}
              className="modal-imagem"
            />
          ) : (
            <div className="produto-icone" aria-hidden="true">
              {produto.icone}
            </div>
          )}
        </div>

        <div className="modal-detalhes-secao">
          <div>
            <span className="modal-dorama-badge">
              <span>🌸</span>
              <span>Coleção K-Drama & Elegância</span>
            </span>

            <h2 id="modal-titulo" className="modal-titulo">
              {produto.nome}
            </h2>

            {produto.vibeDorama && (
              <p className="modal-vibe-dorama">
                <span aria-hidden="true">🎬</span>
                <span>{produto.vibeDorama}</span>
              </p>
            )}

            <div className="modal-preco-caixa">
              <span className="modal-preco-rotulo">Preço exclusivo</span>
              <strong className="modal-preco-valor">
                {formatarPreco(produto.preco)}
              </strong>
            </div>

            <div className="modal-dorama-bloco">
              <span className="modal-dorama-chamada">
                ✨ Inspiração de Dorama:
              </span>
              <p id="modal-dorama-desc" className="modal-dorama-texto">
                "{produto.descricaoDorama}"
              </p>
            </div>
          </div>

          <div className="modal-acoes">
            <button
              type="button"
              className="modal-btn-chat"
              onClick={handleConsultar}
            >
              <span aria-hidden="true">💬</span>
              <span>Tirar dúvidas sobre esta peça no chat</span>
            </button>
            <button
              type="button"
              className="modal-btn-voltar"
              onClick={onFechar}
            >
              Voltar ao catálogo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
