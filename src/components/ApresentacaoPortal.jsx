import React from 'react';
import './ApresentacaoPortal.css';

export default function ApresentacaoPortal({
  onAbrirLogin,
  onAbrirCadastro,
  onVerLoja,
}) {
  return (
    <section className="portal-hero-section" aria-labelledby="portal-titulo">
      <div className="portal-container">
        <div className="portal-header-badge">
          <span>Boutique Layani • Coleção & Gestão</span>
        </div>

        <h1 id="portal-titulo" className="portal-titulo">
          Elegância atemporal inspirada na alta costura e na estética dos doramas contemporâneos.
        </h1>

        <p className="portal-subtitulo">
          Peças com corte refinado, tecidos nobres e atendimento concierge dedicado.
          Explore o catálogo da loja ou acesse a área restrita de gestão.
        </p>

        <div className="portal-botoes-principais">
          <button
            type="button"
            className="btn-portal-login"
            onClick={onAbrirLogin}
          >
            Entrar no Sistema
          </button>

          <button
            type="button"
            className="btn-portal-cadastro"
            onClick={onAbrirCadastro}
          >
            Criar Conta
          </button>

          <button
            type="button"
            className="btn-portal-catalogo"
            onClick={onVerLoja}
          >
            Ver Catálogo da Loja
          </button>
        </div>

        {/* Pilares Institucionais Clean */}
        <div className="portal-pilares-grid">
          <div className="pilar-card">
            <h4>Curadoria Exclusiva</h4>
            <p>Modelagens fluidas, caimento acinturado e estética inspirada em produções de Seul.</p>
          </div>
          <div className="pilar-card">
            <h4>Atendimento Concierge</h4>
            <p>Canal direto de suporte ao vivo para consultoria de medidas, tecidos e reservas.</p>
          </div>
          <div className="pilar-card">
            <h4>Gestão Segura</h4>
            <p>Controle de estoque em tempo real, telemetria analítica e checkout simplificado.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

