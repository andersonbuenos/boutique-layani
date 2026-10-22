import { SESSOES_PADRAO } from '../data/sessoesChatData';

const STORAGE_SESSOES = 'boutique_sessoes_chat';
const STORAGE_VISITANTE_ID = 'boutique_visitante_id';

export function obterIdVisitante() {
  let id = localStorage.getItem(STORAGE_VISITANTE_ID);
  if (!id) {
    id = String(Math.floor(1000 + Math.random() * 9000));
    localStorage.setItem(STORAGE_VISITANTE_ID, id);
  }
  return id;
}

export function carregarSessoes() {
  try {
    const salvo = localStorage.getItem(STORAGE_SESSOES);
    if (salvo) {
      const parsed = JSON.parse(salvo);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return SESSOES_PADRAO;
}

export function salvarSessoes(sessoes) {
  try {
    localStorage.setItem(STORAGE_SESSOES, JSON.stringify(sessoes));
    // Dispara evento para atualizar a Central em tempo real na mesma aba e abas irmãs
    window.dispatchEvent(new Event('boutique_chat_atualizado'));
  } catch {}
}

export function registrarMensagemCliente(usuario, textoCliente, textoResposta) {
  const sessoes = carregarSessoes();
  const hora = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Define identificador e nome do cliente
  let sessaoId;
  let clienteNome;
  let clienteEmail;

  if (usuario) {
    sessaoId = `chat-usr-${usuario.id}`;
    clienteNome = usuario.nome;
    clienteEmail = usuario.email;
  } else {
    const idVisitante = obterIdVisitante();
    sessaoId = `chat-visitante-${idVisitante}`;
    clienteNome = `Cliente Nova #${idVisitante}`;
    clienteEmail = `visitante.${idVisitante}@boutiquelayani.com.br`;
  }

  const index = sessoes.findIndex((s) => s.id === sessaoId);

  const msgCli = {
    id: `cli-${Date.now()}`,
    autor: 'cliente',
    autorNome: clienteNome,
    texto: textoCliente,
    dataHora: hora,
  };

  const msgAst = {
    id: `ast-${Date.now() + 1}`,
    autor: 'assistente',
    autorNome: 'Assistente Virtual',
    texto: textoResposta,
    dataHora: hora,
  };

  if (index >= 0) {
    // Atualiza sessão existente e coloca no topo como ON
    const sessaoAtual = sessoes[index];
    const sessaoAtualizada = {
      ...sessaoAtual,
      status: 'on',
      ultimaMensagem: textoCliente,
      mensagens: [...sessaoAtual.mensagens, msgCli, msgAst],
    };

    const outras = sessoes.filter((_, i) => i !== index);
    salvarSessoes([sessaoAtualizada, ...outras]);
  } else {
    // Cria um NOVO CARD para o cliente novo e coloca no TOPO com alert dot!
    const novaSessao = {
      id: sessaoId,
      clienteNome,
      clienteEmail,
      canal: 'Chat Virtual da Loja',
      status: 'on', // Alert dot ativo!
      atendimentoStatus: 'bot',
      atendenteNome: null,
      ultimaMensagem: textoCliente,
      mensagens: [
        {
          id: `init-${Date.now()}`,
          autor: 'assistente',
          autorNome: 'Assistente Virtual',
          texto: 'Olá! Seja bem-vinda à Boutique Layani. Como posso ajudar você hoje?',
          dataHora: hora,
        },
        msgCli,
        msgAst,
      ],
    };

    salvarSessoes([novaSessao, ...sessoes]);
  }

  // Tenta sincronizar também com o backend se a API estiver disponível
  try {
    fetch('/api/atendimentos/cliente-mensagem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessaoId,
        clienteNome,
        clienteEmail,
        textoCliente,
        textoResposta,
      }),
    }).catch(() => {});
  } catch {}
}
