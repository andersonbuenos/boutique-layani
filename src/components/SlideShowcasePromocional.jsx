import React, { useState, useEffect, useRef } from 'react';
import { PRODUTOS, formatarPreco } from '../data/boutiqueData';
import './SlideShowcasePromocional.css';

const SLIDES_PROPAGANDA = [
  {
    id: 'slide-blazer',
    produtoId: 4,
    tituloBadge: '👑 Lançamento Chaebol',
    manchete: 'Blazer Alfaiataria Seul',
    subtitulo: 'A elegância e autoridade das protagonistas executivas dos K-Dramas.',
    destaqueTexto: 'Linho misto nobre com corte acinturado e botões perolados.',
    preco: 189.9,
    tag: 'Tendência K-Fashion 2026',
    imagem: PRODUTOS[3].imagem,
  },
  {
    id: 'slide-tweed',
    produtoId: 7,
    tituloBadge: '✨ Alta Costura & Gala',
    manchete: 'Conjunto Tweed Chaebol Elegance',
    subtitulo: 'Casaqueto estruturado e saia fina com fios dourados sutis.',
    destaqueTexto: 'A personificação do estilo old money de Seul e sofisticação atemporal.',
    preco: 229.9,
    tag: 'Edição Limitada',
    imagem: PRODUTOS[6].imagem,
  },
  {
    id: 'slide-seda',
    produtoId: 5,
    tituloBadge: '🌸 Romance & Delicadeza',
    manchete: 'Blusa de Seda Gola Laço Gangnam',
    subtitulo: 'Toque suave acetinado com laço clássico removível.',
    destaqueTexto: 'O visual perfeito para jantares românticos e ocasiões especiais.',
    preco: 98.9,
    tag: 'Mais Desejada',
    imagem: PRODUTOS[4].imagem,
  },
  {
    id: 'slide-macacao',
    produtoId: 8,
    tituloBadge: '💃 Tapete Vermelho',
    manchete: 'Macacão Pantalona Seda Hongdae',
    subtitulo: 'Linhas longilíneas alongadoras em crepe de seda puro.',
    destaqueTexto: 'Movimento impecável unindo a vanguarda coreana à elegância brasileira.',
    preco: 169.9,
    tag: 'Sucesso Absoluto',
    imagem: PRODUTOS[7].imagem,
  },
  {
    id: 'slide-saia',
    produtoId: 6,
    tituloBadge: '🥻 Silhueta Hanbok Chic',
    manchete: 'Saia Midi Plissada Hanbok Chic',
    subtitulo: 'Cintura alta modeladora e movimento hipnotizante ao caminhar.',
    destaqueTexto: 'Inspirada nos palácios históricos com a alfaiataria contemporânea.',
    preco: 109.9,
    tag: 'Destaque K-Drama',
    imagem: PRODUTOS[5].imagem,
  },
];

export default function SlideShowcasePromocional({ onAbrirModal, onConsultarNoChat }) {
  const [indiceAtivo, setIndiceAtivo] = useState(0);
  const [estaPausado, setEstaPausado] = useState(false);
  const timerRef = useRef(null);

  const totalSlides = SLIDES_PROPAGANDA.length;
  const slideAtual = SLIDES_PROPAGANDA[indiceAtivo];
  const produtoRef = PRODUTOS.find((p) => p.id === slideAtual.produtoId);

  // Efeito de transição automática a cada 5 segundos
  useEffect(() => {
    if (estaPausado) return;

    timerRef.current = setInterval(() => {
      setIndiceAtivo((prev) => (prev + 1) % totalSlides);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [estaPausado, totalSlides, indiceAtivo]);

  const proximoSlide = () => {
    setIndiceAtivo((prev) => (prev + 1) % totalSlides);
  };

  const slideAnterior = () => {
    setIndiceAtivo((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleAcaoLook = () => {
    if (produtoRef && onAbrirModal) onAbrirModal(produtoRef);
  };

  const handleConsultarChat = () => {
    if (produtoRef && onConsultarNoChat) {
      onConsultarNoChat(produtoRef.nomeCompleto || produtoRef.nome);
    }
  };

  return (
    <section
      className="showcase-promocional-section"
      aria-roledescription="carrossel"
      aria-label="Novas Coleções e Propagandas de Alta Costura da Boutique Layani"
      onMouseEnter={() => setEstaPausado(true)}
      onMouseLeave={() => setEstaPausado(false)}
      onFocus={() => setEstaPausado(true)}
      onBlur={() => setEstaPausado(false)}
    >
      <div className="showcase-card">
        <div className="showcase-info-bloco">
          <div className="showcase-topo-tag">
            <span className="showcase-badge-destaque">{slideAtual.tituloBadge}</span>
            <span className="showcase-tag-colecao">{slideAtual.tag}</span>
          </div>

          <h2 className="showcase-titulo">{slideAtual.manchete}</h2>
          <p className="showcase-subtitulo">{slideAtual.subtitulo}</p>
          <p className="showcase-destaque-desc">{slideAtual.destaqueTexto}</p>

          <div className="showcase-preco-bloco">
            <span className="showcase-preco-rotulo">Preço Oficial de Lançamento:</span>
            <div className="showcase-preco-valor">
              <span className="showcase-preco-cifrao">R$</span>
              <strong>{formatarPreco(slideAtual.preco).replace('R$', '').trim()}</strong>
              <span className="showcase-parcela">em até 6x sem juros ou com PIX instantâneo</span>
            </div>
          </div>

          <div className="showcase-acoes">
            <button
              type="button"
              className="btn-showcase-primario"
              onClick={handleAcaoLook}
              aria-label={`Ver lookbook detalhado de ${slideAtual.manchete}`}
            >
              <span>Ver Lookbook Expandido</span>
              <span aria-hidden="true">✨</span>
            </button>

            <button
              type="button"
              className="btn-showcase-chat"
              onClick={handleConsultarChat}
              aria-label={`Consultar disponibilidade de ${slideAtual.manchete} no chat`}
            >
              <span>Comprar pelo Chat</span>
              <span aria-hidden="true">💬</span>
            </button>
          </div>
        </div>

        <div className="showcase-imagem-bloco" onClick={handleAcaoLook} role="button" tabIndex="0" title="Clique para expandir o look">
          <img
            key={slideAtual.id}
            src={slideAtual.imagem}
            alt={`Foto da roupa ${slideAtual.manchete}`}
            className="showcase-foto-destaque animar-slide-imagem"
          />
          <div className="showcase-overlay-zoom">
            <span>🔍 Clique para ver detalhes e caimento</span>
          </div>
        </div>

        <button
          type="button"
          className="btn-nav-slide btn-nav-anterior"
          onClick={slideAnterior}
          aria-label="Slide anterior"
        >
          ❮
        </button>
        <button
          type="button"
          className="btn-nav-slide btn-nav-proximo"
          onClick={proximoSlide}
          aria-label="Próximo slide"
        >
          ❯
        </button>

        <div className="showcase-dots-container" role="tablist" aria-label="Controle de slides da propaganda">
          {SLIDES_PROPAGANDA.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={idx === indiceAtivo}
              className={`dot-indicador ${idx === indiceAtivo ? 'ativo' : ''}`}
              onClick={() => setIndiceAtivo(idx)}
              aria-label={`Ir para a propaganda ${idx + 1}: ${slide.manchete}`}
            >
              <span className="dot-progresso" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

