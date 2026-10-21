import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
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
import './App.css';

const STORAGE_KEY = 'boutique_layani_chat';

export default function App() {
  const [mensagens, setMensagens] = useState(() => {
    try {
      const salvo = localStorage.getItem(STORAGE_KEY);
      if (salvo) {
        const parsed = JSON.parse(salvo);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignora erro no parse do localStorage
    }
    return [MENSAGEM_BOAS_VINDAS];
  });

  const [isDigitando, setIsDigitando] = useState(false);
  const [produtoModal, setProdutoModal] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mensagens));
    } catch {
      // Ignora erro ao salvar no localStorage
    }
  }, [mensagens]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

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

    // Simula tempo de digitação natural e acolhedor (450ms)
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
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignora erro
    }
  };

  const handleConsultarPrecoCatalogo = (nomeProduto) => {
    const pergunta = `Quanto custa a ${nomeProduto.toLowerCase()}?`;
    handleEnviarMensagem(pergunta);
    // Rola suavemente até o chat para o cliente ver a resposta
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

      <main className="main-content" id="conteudo-principal" tabIndex="-1">
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
      </main>

      <Footer />

      {produtoModal && (
        <ModalProduto
          produto={produtoModal}
          onFechar={() => setProdutoModal(null)}
          onConsultarNoChat={handleConsultarPrecoCatalogo}
        />
      )}
    </div>
  );
}


