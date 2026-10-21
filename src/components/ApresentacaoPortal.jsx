import React from 'react';
import './ApresentacaoPortal.css';

export default function ApresentacaoPortal({
  onAbrirLogin,
  onAbrirCadastro,
  onVerLoja,
  onLoginRapido,
}) {
  return (
    <section className="portal-hero-section" aria-labelledby="portal-titulo">
      <div className="portal-container">
        <div className="portal-header-badge">
          <span>🌸</span>
          <span>Boutique Layani • Moda Feminina & Gestão Exclusiva</span>
        </div>

        <h1 id="portal-titulo" className="portal-titulo">
          Elegância que transcende telas, com gestão segura e atendimento acolhedor.
        </h1>

        <p className="portal-subtitulo">
          Explore nossa coleção inspirada em figurinos clássicos de K-Dramas,
          consulte dúvidas com nosso assistente virtual em tempo real ou acesse o
          painel administrativo de estoque e vendas.
        </p>

        {/* Os Dois Botões Principais Solicitados */}
        <div className="portal-botoes-principais">
          <button
            type="button"
            className="btn-portal-login"
            onClick={onAbrirLogin}
          >
            <span aria-hidden="true">🔐</span>
            <span>Entrar no Sistema (Login)</span>
          </button>

          <button
            type="button"
            className="btn-portal-cadastro"
            onClick={onAbrirCadastro}
          >
            <span aria-hidden="true">✨</span>
            <span>Cadastrar Nova Conta</span>
          </button>
        </div>

        <div className="portal-link-loja">
          <button
            type="button"
            className="btn-link-catalogo"
            onClick={onVerLoja}
          >
            <span>Ou navegue diretamente pelo Catálogo & Chat da Loja</span>
            <span aria-hidden="true"> ➔</span>
          </button>
        </div>

        {/* Guia de Acesso dos 3 Usuários Testes */}
        <div className="portal-card-perfis">
          <div className="perfis-header">
            <h3>👥 Usuários de Demonstração (Clique para testar):</h3>
            <p>Selecione um perfil para preenchimento e login automático:</p>
          </div>

          <div className="perfis-grid">
            <div
              className="perfil-card perfil-admin"
              onClick={() =>
                onLoginRapido('admin@boutiquelayani.com.br', 'Admin@Layani2026')
              }
              role="button"
              tabIndex="0"
              title="Clique para logar como Administradora"
            >
              <div className="perfil-icon">👑</div>
              <div className="perfil-info">
                <h4>Administradora</h4>
                <p className="perfil-permissao">
                  <strong>Acesso Total:</strong> Dashboard, Estoque, Vendas, Catálogo e Swagger API (somente GET).
                </p>
                <code>admin@boutiquelayani.com.br</code>
              </div>
            </div>

            <div
              className="perfil-card perfil-atendente"
              onClick={() =>
                onLoginRapido('atendente@boutiquelayani.com.br', 'Atendente@2026')
              }
              role="button"
              tabIndex="0"
              title="Clique para logar como Atendente"
            >
              <div className="perfil-icon">💼</div>
              <div className="perfil-info">
                <h4>Atendente</h4>
                <p className="perfil-permissao">
                  <strong>Operacional:</strong> Controle de Estoque e Tela Principal com Atendente Virtual.
                </p>
                <code>atendente@boutiquelayani.com.br</code>
              </div>
            </div>

            <div
              className="perfil-card perfil-cliente"
              onClick={() => onLoginRapido('cliente@gmail.com', 'Cliente@2026')}
              role="button"
              tabIndex="0"
              title="Clique para logar como Cliente"
            >
              <div className="perfil-icon">🛍️</div>
              <div className="perfil-info">
                <h4>Cliente da Loja</h4>
                <p className="perfil-permissao">
                  <strong>Público:</strong> Catálogo com detalhes dos doramas, consulta de preços e Chat.
                </p>
                <code>cliente@gmail.com</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
