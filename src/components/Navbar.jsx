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
    admin: { label: 'Administrador', badge: 'badge-admin' },
    atendente: { label: 'Atendente', badge: 'badge-atendente' },
    cliente: { label: 'Cliente', badge: 'badge-cliente' },
  };

  const currentRole = usuario ? roleLabels[usuario.role] : null;

  return (
    <nav className="main-navbar" aria-label="Navegação do sistema">
      <div className="navbar-container">
        <div className="navbar-links">
          {/* Tela Principal da Loja (Catálogo & Chat) - Acessível para todos */}
          <button
            type="button"
            className={`nav-btn ${telaAtiva === 'loja' ? 'ativo' : ''}`}
            onClick={() => onMudarTela('loja')}
          >
            <span>Catálogo & Chat</span>
          </button>

          {/* Tela de Apresentação Institucional */}
          <button
            type="button"
            className={`nav-btn ${telaAtiva === 'portal' ? 'ativo' : ''}`}
            onClick={() => onMudarTela('portal')}
          >
            <span>Conceito</span>
          </button>

          {/* Controle de Estoque - Acessível para Admin e Atendente */}
          {(isAdmin || isAtendente) && (
            <button
              type="button"
              className={`nav-btn ${telaAtiva === 'estoque' ? 'ativo' : ''}`}
              onClick={() => onMudarTela('estoque')}
            >
              <span>Estoque</span>
            </button>
          )}

          {/* Central de Atendimentos ao Vivo - Acessível para Admin e Atendente */}
          {(isAdmin || isAtendente) && (
            <button
              type="button"
              className={`nav-btn ${telaAtiva === 'chats' ? 'ativo' : ''}`}
              onClick={() => onMudarTela('chats')}
            >
              <span className="alert-dot-pulse" aria-hidden="true"></span>
              <span>Chats ao Vivo</span>
            </button>
          )}

          {/* Vendas - Acessível apenas para Admin */}
          {isAdmin && (
            <button
              type="button"
              className={`nav-btn ${telaAtiva === 'vendas' ? 'ativo' : ''}`}
              onClick={() => onMudarTela('vendas')}
            >
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
              <span>Dashboard</span>
            </button>
          )}

          {/* Swagger API - Link direto para Admin */}
          {isAdmin && usuario?.token && (
            <a
              href={`/api-docs?token=${usuario.token}`}
              target="_blank"
              rel="noopener noreferrer"
              className="nav-btn nav-btn-swagger"
              title="Documentação OpenAPI Swagger"
            >
              <span>Swagger API ↗</span>
            </a>
          )}
        </div>

        <div className="navbar-user-area">
          {usuario ? (
            <div className="user-profile-badge">
              <span className={`role-badge ${currentRole?.badge}`}>
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
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-entrar-nav"
              onClick={onAbrirAuth}
            >
              <span>Acessar Plataforma</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

