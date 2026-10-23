import React, { useState, useEffect } from 'react';
import { SESSOES_PADRAO } from '../data/sessoesChatData';
import CardSessaoChat from './CardSessaoChat';
import ModalVerAtendimentoInovador from './ModalVerAtendimentoInovador';
import ModalAtendimentoAssumido from './ModalAtendimentoAssumido';
import { emitirEventoChat, escutarEventosChat } from '../services/liveChatBroadcast';


import './CentralAtendimentoView.css';

const horaAgora = () =>
  new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

export default function CentralAtendimentoView({ usuario }) {
  const [sessoes, setSessoes] = useState(() => {
    try {
      const s = localStorage.getItem('boutique_sessoes_chat');
      return s ? JSON.parse(s) : SESSOES_PADRAO;
    } catch {
      return SESSOES_PADRAO;
    }
  });

  const [chatSelecionado, setChatSelecionado] = useState(null);
  const [modalVer, setModalVer] = useState(false);
  const [modalAssumir, setModalAssumir] = useState(false);
  const [contagemDelay, setContagemDelay] = useState(0);

  useEffect(() => {
    try {
      localStorage.setItem('boutique_sessoes_chat', JSON.stringify(sessoes));
    } catch {}
  }, [sessoes]);

  useEffect(() => {
    const recarregar = () => {
      try {
        const s = localStorage.getItem('boutique_sessoes_chat');
        if (s) {
          const parsed = JSON.parse(s);
          if (Array.isArray(parsed)) setSessoes(parsed);
        }
      } catch {}
    };

    const cleanup = escutarEventosChat((evento) => {
      if (evento?.tipo === 'MENSAGEM_CLIENTE' || evento?.tipo === 'NOVO_CHAT') {
        recarregar();
      }
    });

    window.addEventListener('boutique_chat_atualizado', recarregar);
    window.addEventListener('storage', recarregar);
    const interval = setInterval(recarregar, 2000);

    return () => {
      cleanup();
      window.removeEventListener('boutique_chat_atualizado', recarregar);
      window.removeEventListener('storage', recarregar);
      clearInterval(interval);
    };
  }, []);

  const handleVerAtendimento = (sessao) => {
    setChatSelecionado(sessao);
    setModalVer(true);
  };


  const handleAssumirAtendimento = (sessao) => {
    setModalVer(false);
    const nomeAtd = usuario?.nome || 'Atendente';
    const agora = horaAgora();

    const cardId = `chat-atd-${sessao.id}`;
    const cardAtendente = {
      ...sessao,
      id: cardId,
      status: 'on',
      atendimentoStatus: 'direcionando',
      atendenteNome: nomeAtd,
      mensagens: [
        ...sessao.mensagens,
        {
          id: `sys-${Date.now()}`,
          autor: 'sistema',
          autorNome: 'Sistema',
          texto: 'Direcionando seu atendimento para um atendente especializado...',
          dataHora: agora,
        },
      ],
    };

    setChatSelecionado(cardAtendente);
    setModalAssumir(true);
    setSessoes((p) => [cardAtendente, ...p.filter((s) => s.id !== sessao.id && s.id !== cardId)]);

    // Requisito 8: Fecha o card antigo do assistente após 10 segundos
    setTimeout(() => {
      setSessoes((p) => p.filter((s) => s.id !== sessao.id));
    }, 10000);

    setContagemDelay(5);
    const timer = setInterval(() => {
      setContagemDelay((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const hora = horaAgora();
          const msgAtd = {
            id: `atd-${Date.now()}`,
            autor: 'atendente',
            autorNome: nomeAtd,
            texto: `${nomeAtd}: Olá, meu nome é ${nomeAtd}, como posso te ajudar? Insira sua dúvida abaixo.`,
            dataHora: hora,
          };

          setSessoes((p) =>
            p.map((s) => {
              if (s.id === cardId) {
                const finalS = {
                  ...s,
                  atendimentoStatus: 'humano',
                  mensagens: [...s.mensagens, msgAtd],
                  ultimaMensagem: msgAtd.texto,
                };
                setChatSelecionado(finalS);
                emitirEventoChat({ tipo: 'ATENDENTE_ASSUMIU', sessao: finalS });
                return finalS;
              }
              return s;
            })
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleEnviarMensagem = (texto) => {
    if (!chatSelecionado) return;
    const nomeAtd = usuario?.nome || 'Atendente';
    const hora = horaAgora();
    const novaMsg = {
      id: `msg-${Date.now()}`,
      autor: 'atendente',
      autorNome: nomeAtd,
      texto: `${nomeAtd}: ${texto}`,
      dataHora: hora,
    };

    const atual = {
      ...chatSelecionado,
      status: 'on',
      mensagens: [...chatSelecionado.mensagens, novaMsg],
      ultimaMensagem: novaMsg.texto,
    };

    setSessoes((p) => p.map((s) => (s.id === chatSelecionado.id ? atual : s)));
    setChatSelecionado(atual);

    emitirEventoChat({
      tipo: 'MENSAGEM_ATENDENTE',
      sessaoId: chatSelecionado.id,
      mensagem: novaMsg,
    });
  };

  // Requisito 9: Ao encerrar o atendimento, fecha o card automaticamente
  const handleEncerrarAtendimento = () => {
    if (!chatSelecionado) return;
    const hora = horaAgora();
    const msgFim = {
      id: `fim-${Date.now()}`,
      autor: 'assistente',
      autorNome: 'Assistente Virtual',
      texto:
        'Atendimento com nossa especialista finalizado com muito carinho! Agradecemos por escolher a Boutique Layani. Se precisar de mais alguma coisa ou quiser tirar novas dúvidas, estou sempre por aqui à sua disposição. Tenha um dia maravilhoso e repleto de elegância! ✨🌸',
      dataHora: hora,
    };

    emitirEventoChat({
      tipo: 'ATENDIMENTO_ENCERRADO',
      sessaoId: chatSelecionado.id,
      mensagem: msgFim,
    });

    // Remove o card automaticamente
    setSessoes((p) => p.filter((s) => s.id !== chatSelecionado.id));
    setModalAssumir(false);
    setChatSelecionado(null);
  };

  const totalAtivos = sessoes.filter((s) => s.status === 'on').length;

  return (
    <div className="central-atendimento-container">
      <div className="central-header">
        <div>
          <span className="central-badge-topo">🔴 Central de Atendimentos ao Vivo</span>
          <h2 className="central-titulo">Painel de Chats dos Clientes</h2>
          <p className="central-subtitulo">
            Acompanhe conversas em tempo real, veja mensagens e assuma o atendimento com 1 clique.
          </p>
        </div>

        <div className="central-kpis-mini">
          <div className={`kpi-mini-card ${totalAtivos > 0 ? 'ativo' : ''}`}>
            <span className="alert-dot-pulse" aria-hidden="true"></span>
            <span>{totalAtivos} Chat(s) Online</span>
          </div>
          <div className="kpi-mini-card">
            <span>📁 {sessoes.length} Sessões Ativas</span>
          </div>
        </div>
      </div>

      <div className="chats-grid">
        {sessoes.map((s) => (
          <CardSessaoChat
            key={s.id}
            sessao={s}
            onVerAtendimento={handleVerAtendimento}
            onAssumirAtendimento={handleAssumirAtendimento}
          />
        ))}
      </div>

      {modalVer && chatSelecionado && (
        <ModalVerAtendimentoInovador
          chat={chatSelecionado}
          onFechar={() => setModalVer(false)}
          onAssumir={(sessao) => handleAssumirAtendimento(sessao)}
        />
      )}

      {modalAssumir && chatSelecionado && (
        <ModalAtendimentoAssumido
          chat={chatSelecionado}
          contagemDelay={contagemDelay}
          usuario={usuario}
          onFechar={() => setModalAssumir(false)}
          onEnviarMensagem={handleEnviarMensagem}
          onEncerrar={handleEncerrarAtendimento}
        />
      )}
    </div>
  );
}



