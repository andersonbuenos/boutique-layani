import React from 'react';
import './Navbar.css';

export default function Navbar({
  usuario,
  telaAtiva,
  onMudarTela,
  onAbrirAuth,
  onLogout,
}) {
  const isAdmin = usuario?.role === 'admin';
  const isAtendente = usuario?.role === 'atendente';

  const roleLabels = {
    admin: { label: 'Administradora', badge: 'badge-admin', icon: '👑' },
    atendente: { label: 'Atendente', badge: 'badge-atendente', icon: '💼' },
    cliente: { label: 'Cliente', badge: 'badge-cliente', icon: '🛍️' },
  };

  const currentRole = usuario ? roleLabels[usuario.role] : null;

  return (
    <nav className="main-navbar" aria-label="Navegação do sistema">
      <div className="navbar-container">
        <div className="navbar-links">
          {/* Tela de Apresentação / Portal */}
          <button
            type="button"
            className={`nav-btn ${telaAtiva === 'portal' ? 'ativo' : ''}`}
            onClick={() => onMudarTela('portal')}
          >
            <span aria-hidden="true">✨</span>
            <span>Apresentação</span>
          </button>

          {/* Tela Principal da Loja (Catálogo & Chat) - Acessível para todos */}
          <button
            type="button"
            className={`nav-btn ${telaAtiva === 'loja' ? 'ativo' : ''}`}
            onClick={() => onMudarTela('loja')}
          >
            <span aria-hidden="true">👗</span>
            <span>Catálogo & Chat</span>
          </button>

          {/* Controle de Estoque - Acessível para Admin e Atendente */}
          {(isAdmin || isAtendente) && (
            <button
              type="button"
              className={`nav-btn ${telaAtiva === 'estoque' ? 'ativo' : ''}`}
              onClick={() => onMudarTela('estoque')}
            >
              <span aria-hidden="true">📦</span>
              <span>Estoque</span>
            </button>
          )}

          {/* Vendas - Acessível apenas para Admin */}
          {isAdmin && (
            <button
              type="button"
              className={`nav-btn ${telaAtiva === 'vendas' ? 'ativo' : ''}`}
              onClick={() => onMudarTela('vendas')}
            >
              <span aria-hidden="true">💰</span>
              <span>Vendas</span>
            </button>
          )}

          {/* Dashboard Executivo - Acessível apenas para Admin */}
          {isAdmin && (
            <button
              type="button"
              className={`nav-btn ${telaAtiva === 'dashboard' ? 'ativo' : ''}`}
              onClick={() => onMudarTela('dashboard')}
            >
              <span aria-hidden="true">📊</span>
              <span>Dashboard</span>
            </button>
          )}

          {/* Swagger API - Link especial direto para Admin */}
          {isAdmin && usuario?.token && (
            <a
              href={`/api-docs?token=${usuario.token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-btn nav-btn-swagger"
              title="Abrir documentação interativa Swagger com autenticação de Admin"
            >
              <span aria-hidden="true">🔒</span>
              <span>Swagger (GET) ↗</span>
            </a>
          )}
        </div>

        <div className="navbar-user-area">
          {usuario ? (
            <div className="user-profile-badge">
              <span className={`role-badge ${currentRole?.badge}`}>
                <span aria-hidden="true">{currentRole?.icon}</span>
                <span>{currentRole?.label}</span>
              </span>
              <span className="user-name" title={usuario.email}>
                {usuario.nome}
              </span>
              <button
                type="button"
                className="btn-logout"
                onClick={onLogout}
                aria-label="Sair da conta"
                title="Sair do sistema"
              >
                <span>Sair</span>
                <span aria-hidden="true">🚪</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-entrar-nav"
              onClick={onAbrirAuth}
            >
              <span aria-hidden="true">🔐</span>
              <span>Entrar / Cadastrar</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
