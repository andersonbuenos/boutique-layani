import React, { useState } from 'react';
import { loginUsuario, cadastrarUsuario } from '../services/authService';
import './AuthModal.css';

export default function AuthModal({
  modoInicial = 'login',
  onFechar,
  onSucessoLogin,
}) {
  const [modo, setModo] = useState(modoInicial);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      let resultado;
      if (modo === 'login') {
        resultado = await loginUsuario(email, senha);
      } else {
        resultado = await cadastrarUsuario(nome, email, senha);
      }

      onSucessoLogin(resultado.usuario, resultado.token);
      onFechar();
    } catch (err) {
      setErro(err.message || 'Erro ao conectar ao servidor');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div
      className="auth-modal-backdrop"
      onClick={(e) => e.target === e.currentTarget && onFechar()}
      role="presentation"
    >
      <div
        className="auth-modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-titulo"
      >
        <button
          type="button"
          className="auth-btn-fechar"
          onClick={onFechar}
          aria-label="Fechar janela"
        >
          ✕
        </button>

        <div className="auth-modal-header">
          <h2 id="auth-modal-titulo" className="auth-modal-title">
            {modo === 'login' ? 'Identificação' : 'Criar Nova Conta'}
          </h2>
          <p className="auth-modal-subtitle">
            Boutique Layani • Controle de Acesso Restrito
          </p>
        </div>

        <div className="auth-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'login'}
            className={`auth-tab ${modo === 'login' ? 'ativo' : ''}`}
            onClick={() => {
              setModo('login');
              setErro('');
            }}
          >
            Entrar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modo === 'cadastro'}
            className={`auth-tab ${modo === 'cadastro' ? 'ativo' : ''}`}
            onClick={() => {
              setModo('cadastro');
              setErro('');
            }}
          >
            Cadastrar
          </button>
        </div>

        {erro && <div className="auth-alerta-erro" role="alert">{erro}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {modo === 'cadastro' && (
            <div className="auth-campo">
              <label htmlFor="auth-nome">Nome Completo</label>
              <input
                id="auth-nome"
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                autoComplete="name"
              />
            </div>
          )}

          <div className="auth-campo">
            <label htmlFor="auth-email">E-mail</label>
            <input
              id="auth-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@exemplo.com"
              autoComplete="email"
            />
          </div>

          <div className="auth-campo">
            <label htmlFor="auth-senha">Senha</label>
            <input
              id="auth-senha"
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              autoComplete={modo === 'login' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            type="submit"
            className="auth-btn-submeter"
            disabled={carregando}
          >
            {carregando
              ? 'Validando...'
              : modo === 'login'
              ? 'Acessar Plataforma'
              : 'Concluir Cadastro'}
          </button>
        </form>
      </div>
    </div>
  );
}

