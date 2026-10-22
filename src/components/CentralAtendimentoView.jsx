import React, { useState, useEffect } from 'react';
import { SESSOES_PADRAO } from '../data/sessoesChatData';
import CardSessaoChat from './CardSessaoChat';
import ModalAtendimentoGaveta from './ModalAtendimentoGaveta';
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
  const [modoModal, setModoModal] = useState('ver');
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

    window.addEventListener('boutique_chat_atualizado', recarregar);
    window.addEventListener('storage', recarregar);
    const interval = setInterval(recarregar, 2000);

    return () => {
      window.removeEventListener('boutique_chat_atualizado', recarregar);
      window.removeEventListener('storage', recarregar);
      clearInterval(interval);
    };
  }, []);


  const handleVerAtendimento = (sessao) => {
    setChatSelecionado(sessao);
    setModoModal('ver');
    setContagemDelay(0);
  };

  const handleAssumirAtendimento = (sessao) => {
    const nomeAtd = usuario?.nome || 'Atendente';
    setChatSelecionado(sessao);
    setModoModal('assumir');

    if (sessao.atendenteNome === nomeAtd && sessao.atendimentoStatus === 'humano') {
      setContagemDelay(0);
      return;
    }

    const msgDir = {
      id: `sys-${Date.now()}`,
      autor: 'sistema',
      autorNome: 'Sistema',
      texto: 'Direcionando seu atendimento para um atendente especializado...',
      dataHora: horaAgora(),
    };

    const atualizada = {
      ...sessao,
      status: 'on',
      atendimentoStatus: 'direcionando',
      atendenteNome: nomeAtd,
      mensagens: [...sessao.mensagens, msgDir],
    };

    setSessoes((p) => p.map((s) => (s.id === sessao.id ? atualizada : s)));
    setChatSelecionado(atualizada);

    setContagemDelay(5);
    const timer = setInterval(() => {
      setContagemDelay((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          const msgAtd = {
            id: `atd-${Date.now()}`,
            autor: 'atendente',
            autorNome: nomeAtd,
            texto: `${nomeAtd}: Olá, meu nome é ${nomeAtd}, como posso te ajudar? Insira sua dúvida abaixo.`,
            dataHora: horaAgora(),
          };

          setSessoes((p) =>
            p.map((s) => {
              if (s.id === sessao.id) {
                const finalS = {
                  ...s,
                  atendimentoStatus: 'humano',
                  mensagens: [...s.mensagens, msgAtd],
                  ultimaMensagem: msgAtd.texto,
                };
                setChatSelecionado(finalS);
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
    const novaMsg = {
      id: `msg-${Date.now()}`,
      autor: 'atendente',
      autorNome: nomeAtd,
      texto: `${nomeAtd}: ${texto}`,
      dataHora: horaAgora(),
    };

    const atual = {
      ...chatSelecionado,
      status: 'on',
      mensagens: [...chatSelecionado.mensagens, novaMsg],
      ultimaMensagem: novaMsg.texto,
    };

    setSessoes((p) => p.map((s) => (s.id === chatSelecionado.id ? atual : s)));
    setChatSelecionado(atual);
  };

  const handleEncerrarAtendimento = () => {
    if (!chatSelecionado) return;
    const msgFim = {
      id: `fim-${Date.now()}`,
      autor: 'assistente',
      autorNome: 'Assistente Virtual',
      texto:
        'Atendimento com nossa especialista finalizado com muito carinho! Agradecemos por escolher a Boutique Layani. Se precisar de mais alguma coisa ou quiser tirar novas dúvidas, estou sempre por aqui à sua disposição. Tenha um dia maravilhoso e repleto de elegância! ✨🌸',
      dataHora: horaAgora(),
    };

    const encerrada = {
      ...chatSelecionado,
      status: 'off',
      atendimentoStatus: 'encerrado',
      mensagens: [...chatSelecionado.mensagens, msgFim],
      ultimaMensagem: 'Atendimento finalizado com sucesso.',
    };

    setSessoes((p) => p.map((s) => (s.id === chatSelecionado.id ? encerrada : s)));
    setChatSelecionado(encerrada);
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
            <span>📁 {sessoes.length} Sessões</span>
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

      {chatSelecionado && (
        <ModalAtendimentoGaveta
          chat={chatSelecionado}
          modo={modoModal}
          contagemDelay={contagemDelay}
          usuario={usuario}
          onFechar={() => setChatSelecionado(null)}
          onEnviarMensagem={handleEnviarMensagem}
          onEncerrar={handleEncerrarAtendimento}
        />
      )}
    </div>
  );
}
