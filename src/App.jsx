import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import ApresentacaoPortal from './components/ApresentacaoPortal';
import AuthModal from './components/AuthModal';
import EstoqueView from './components/EstoqueView';
import VendasView from './components/VendasView';
import CentralAtendimentoView from './components/CentralAtendimentoView';

import DashboardView from './components/DashboardView';
import Catalogo from './components/Catalogo';
import Atendimento from './components/Atendimento';
import Footer from './components/Footer';
import ModalProduto from './components/ModalProduto';
import {
  MENSAGEM_BOAS_VINDAS,
  LOJA,
  formatarPreco,
} from './data/boutiqueData';
import { responderPergunta } from './services/atendenteService';
import { loginUsuario } from './services/authService';
import { registrarMensagemCliente } from './services/chatSyncService';
import { escutarEventosChat } from './services/liveChatBroadcast';


import './App.css';


const STORAGE_CHAT = 'boutique_layani_chat';
const STORAGE_USER = 'boutique_layani_user';
const STORAGE_TOKEN = 'boutique_layani_token';

export default function App() {
  const [usuario, setUsuario] = useState(() => {
    try {
      const u = localStorage.getItem(STORAGE_USER);
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_TOKEN) || '');
  const [telaAtiva, setTelaAtiva] = useState(() => (usuario ? 'loja' : 'portal'));
  const [modalAuth, setModalAuth] = useState(false);
  const [modoAuth, setModoAuth] = useState('login');

  const [mensagens, setMensagens] = useState(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_CHAT);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Ignora erro
    }
    return [MENSAGEM_BOAS_VINDAS];
  });

  const [isDigitando, setIsDigitando] = useState(false);
  const [produtoModal, setProdutoModal] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHAT, JSON.stringify(mensagens));
    } catch {
      // Ignora erro
    }
  }, [mensagens]);
  // Sincronização Simultânea Instantânea com Atendente (0ms Delay)
  useEffect(() => {
    const cleanup = escutarEventosChat((evento) => {
      if (evento?.tipo === 'MENSAGEM_ATENDENTE' && evento.mensagem) {
        setMensagens((prev) => [...prev, evento.mensagem]);
      } else if (evento?.tipo === 'ATENDIMENTO_ENCERRADO' && evento.mensagem) {
        setMensagens((prev) => [...prev, evento.mensagem]);
      } else if (evento?.tipo === 'VENDA_CONCLUIDA' && evento.pedido) {
        setMensagens((prev) => [
          ...prev,
          {
            id: `venda-${Date.now()}`,
            autor: 'assistente',
            texto: `🎉 Compra Confirmada! Pedido ${evento.pedido.id} gerado com sucesso na Boutique Layani.`,
            dataHora: new Date().toISOString(),
          },
        ]);
      }
    });

    return () => cleanup();
  }, []);



  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSucessoLogin = (novoUsuario, novoToken) => {
    const userComToken = { ...novoUsuario, token: novoToken };
    setUsuario(userComToken);
    setToken(novoToken);
    try {
      localStorage.setItem(STORAGE_USER, JSON.stringify(userComToken));
      localStorage.setItem(STORAGE_TOKEN, novoToken);
    } catch {
      // Ignora erro
    }

    if (novoUsuario.role === 'admin') {
      setTelaAtiva('dashboard');
    } else if (novoUsuario.role === 'atendente') {
      setTelaAtiva('estoque');
    } else {
      setTelaAtiva('loja');
    }
  };

  const handleLogout = () => {
    setUsuario(null);
    setToken('');
    try {
      localStorage.removeItem(STORAGE_USER);
      localStorage.removeItem(STORAGE_TOKEN);
    } catch {
      // Ignora erro
    }
    setTelaAtiva('portal');
  };

  const handleLoginRapido = async (email, senha) => {
    try {
      const data = await loginUsuario(email, senha);
      handleSucessoLogin(data.usuario, data.token);
    } catch {
      setModoAuth('login');
      setModalAuth(true);
    }
  };


  const handleEnviarMensagem = (textoPergunta) => {
    const textoLimpo = textoPergunta.trim();
    if (!textoLimpo || isDigitando) return;

    const agora = new Date().toISOString();
    const mensagemCliente = {
      id: `cli-${Date.now()}`,
      autor: 'cliente',
      texto: textoLimpo,
      dataHora: agora,
    };

    setMensagens((prev) => [...prev, mensagemCliente]);
    setIsDigitando(true);

    timerRef.current = setTimeout(() => {
      const textoResposta = responderPergunta(textoLimpo);
      const mensagemAssistente = {
        id: `ast-${Date.now() + 1}`,
        autor: 'assistente',
        texto: textoResposta,
        dataHora: new Date().toISOString(),
      };

      setMensagens((prev) => [...prev, mensagemAssistente]);
      setIsDigitando(false);

      // Registra a mensagem na Central de Atendimentos:
      // se for um cliente novo, cria um NOVO CARD no topo com alert dot pulsante!
      registrarMensagemCliente(usuario, textoLimpo, textoResposta);
    }, 450);
  };


  const handleLimparConversa = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsDigitando(false);

    const resetMsg = {
      ...MENSAGEM_BOAS_VINDAS,
      id: `msg-${Date.now()}`,
      dataHora: new Date().toISOString(),
    };
    setMensagens([resetMsg]);
    try {
      localStorage.removeItem(STORAGE_CHAT);
    } catch {
      // Ignora erro
    }
  };

  const handleConsultarPrecoCatalogo = (nomeProduto) => {
    const pergunta = `Quanto custa a ${nomeProduto.toLowerCase()}?`;
    handleEnviarMensagem(pergunta);
    const chatEl = document.querySelector('.atendimento-section');
    if (chatEl) {
      chatEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-wrapper">
      <a href="#conteudo-principal" className="skip-link">
        Pular para o conteúdo principal
      </a>

      <Header />

      <Navbar
        usuario={usuario}
        telaAtiva={telaAtiva}
        onMudarTela={(tela) => setTelaAtiva(tela)}
        onAbrirAuth={() => {
          setModoAuth('login');
          setModalAuth(true);
        }}
        onLogout={handleLogout}
      />

      <main className="main-content" id="conteudo-principal" tabIndex="-1">
        {telaAtiva === 'portal' && (
          <ApresentacaoPortal
            onAbrirLogin={() => {
              setModoAuth('login');
              setModalAuth(true);
            }}
            onAbrirCadastro={() => {
              setModoAuth('cadastro');
              setModalAuth(true);
            }}
            onVerLoja={() => setTelaAtiva('loja')}
            onLoginRapido={handleLoginRapido}
          />
        )}

        {telaAtiva === 'loja' && (
          <>
            <aside className="banner-info" aria-label="Informações essenciais da loja">
              <div className="banner-item">
                <span aria-hidden="true">🕒</span>
                <span>
                  <strong>Horário de Funcionamento:</strong> {LOJA.diasFuncionamento}, das {LOJA.horarioAbertura} às {LOJA.horarioFechamento}
                </span>
              </div>
              <div className="banner-item">
                <span aria-hidden="true">🛵</span>
                <span>
                  <strong>Taxa Fixa de Entrega:</strong> {formatarPreco(LOJA.taxaEntrega)}
                </span>
              </div>
            </aside>

            <Catalogo
              onConsultarPreco={handleConsultarPrecoCatalogo}
              onAbrirModal={(produto) => setProdutoModal(produto)}
            />

            <Atendimento
              mensagens={mensagens}
              isDigitando={isDigitando}
              onEnviarMensagem={handleEnviarMensagem}
              onLimparConversa={handleLimparConversa}
            />
          </>
        )}

        {telaAtiva === 'estoque' && (
          <EstoqueView token={token} usuario={usuario} />
        )}

        {telaAtiva === 'chats' && (
          <CentralAtendimentoView usuario={usuario} token={token} />
        )}


        {telaAtiva === 'vendas' && (
          <VendasView token={token} usuario={usuario} />
        )}

        {telaAtiva === 'dashboard' && (
          <DashboardView token={token} usuario={usuario} />
        )}
      </main>

      <Footer />

      {produtoModal && (
        <ModalProduto
          produto={produtoModal}
          onFechar={() => setProdutoModal(null)}
          onConsultarNoChat={handleConsultarPrecoCatalogo}
        />
      )}

      {modalAuth && (
        <AuthModal
          modoInicial={modoAuth}
          onFechar={() => setModalAuth(false)}
          onSucessoLogin={handleSucessoLogin}
        />
      )}
    </div>
  );
}



