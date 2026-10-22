import { Router } from 'express';
import { SESSOES_CHAT } from '../data/chatSessions.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { requireRoles } from '../middlewares/roleMiddleware.js';

export const atendimentosRouter = Router();

// Todos os endpoints abaixo são acessíveis exclusivamente por 'admin' e 'atendente'
atendimentosRouter.use(authMiddleware, requireRoles(['admin', 'atendente']));

// GET /api/atendimentos - Lista todos os cards de atendimento
atendimentosRouter.get('/', (req, res) => {
  const cards = SESSOES_CHAT.map((sessao) => {
    const ultimaMsg = sessao.mensagens[sessao.mensagens.length - 1];
    return {
      id: sessao.id,
      clienteNome: sessao.clienteNome,
      clienteEmail: sessao.clienteEmail,
      canal: sessao.canal,
      status: sessao.status, // 'on' (com alert dot) ou 'off'
      atendimentoStatus: sessao.atendimentoStatus, // 'bot', 'direcionando', 'humano', 'encerrado'
      atendenteNome: sessao.atendenteNome,
      ultimaMensagem: ultimaMsg ? ultimaMsg.texto : '',
      ultimaMensagemEm: sessao.ultimaMensagemEm,
      totalMensagens: sessao.mensagens.length,
    };
  });

  return res.json({
    totalAtivos: cards.filter((c) => c.status === 'on').length,
    totalGeral: cards.length,
    cards,
  });
});

// GET /api/atendimentos/:id - Detalhes e mensagens de um chat
atendimentosRouter.get('/:id', (req, res) => {
  const sessao = SESSOES_CHAT.find((s) => s.id === req.params.id);
  if (!sessao) {
    return res.status(404).json({ erro: 'Sessão de atendimento não encontrada.' });
  }
  return res.json(sessao);
});

// POST /api/atendimentos/:id/assumir - Assume o atendimento com delay de 5s
atendimentosRouter.post('/:id/assumir', (req, res) => {
  const sessao = SESSOES_CHAT.find((s) => s.id === req.params.id);
  if (!sessao) {
    return res.status(404).json({ erro: 'Sessão não encontrada.' });
  }

  const atendenteNome = req.body?.atendenteNome || req.user?.nome || 'Atendente Especializado';

  // 1. Imediatamente avisa que está direcionando e coloca status 'on'
  sessao.status = 'on';
  sessao.atendimentoStatus = 'direcionando';
  sessao.atendenteNome = atendenteNome;

  const msgDirecionando = {
    id: `msg-${Date.now()}-dir`,
    autor: 'sistema',
    autorNome: 'Sistema',
    texto: 'Direcionando seu atendimento para um atendente especializado...',
    dataHora: new Date().toISOString(),
  };
  sessao.mensagens.push(msgDirecionando);
  sessao.ultimaMensagemEm = msgDirecionando.dataHora;

  // 2. Insere a mensagem do atendente após delay de 5 segundos
  setTimeout(() => {
    sessao.atendimentoStatus = 'humano';
    const msgAtendente = {
      id: `msg-${Date.now()}-atd`,
      autor: 'atendente',
      autorNome: atendenteNome,
      texto: `${atendenteNome}: Olá, meu nome é ${atendenteNome}, como posso te ajudar? Insira sua dúvida abaixo.`,
      dataHora: new Date().toISOString(),
    };
    sessao.mensagens.push(msgAtendente);
    sessao.ultimaMensagemEm = msgAtendente.dataHora;
  }, 5000);

  return res.json({
    mensagem: 'Atendimento sendo direcionado com delay de 5 segundos.',
    sessao,
  });
});

// POST /api/atendimentos/:id/responder - Atendente envia mensagem personalizada
atendimentosRouter.post('/:id/responder', (req, res) => {
  const sessao = SESSOES_CHAT.find((s) => s.id === req.params.id);
  if (!sessao) {
    return res.status(404).json({ erro: 'Sessão não encontrada.' });
  }

  const { texto } = req.body || {};
  if (!texto || !texto.trim()) {
    return res.status(400).json({ erro: 'Texto da mensagem é obrigatório.' });
  }

  const autorNome = req.user?.nome || sessao.atendenteNome || 'Atendente';

  const novaMsg = {
    id: `msg-${Date.now()}-rep`,
    autor: 'atendente',
    autorNome,
    texto: `${autorNome}: ${texto.trim()}`,
    dataHora: new Date().toISOString(),
  };

  sessao.status = 'on';
  sessao.mensagens.push(novaMsg);
  sessao.ultimaMensagemEm = novaMsg.dataHora;

  return res.json({
    sucesso: true,
    mensagem: novaMsg,
    sessao,
  });
});

// POST /api/atendimentos/:id/encerrar - Encerra o atendimento humano
atendimentosRouter.post('/:id/encerrar', (req, res) => {
  const sessao = SESSOES_CHAT.find((s) => s.id === req.params.id);
  if (!sessao) {
    return res.status(404).json({ erro: 'Sessão não encontrada.' });
  }

  sessao.status = 'off';
  sessao.atendimentoStatus = 'encerrado';

  // Mensagem calorosa de agradecimento que volta para o chat do bot
  const msgAgradecimento = {
    id: `msg-${Date.now()}-fim`,
    autor: 'assistente',
    autorNome: 'Assistente Virtual',
    texto:
      'Atendimento com nossa especialista finalizado com muito carinho! Agradecemos por escolher a Boutique Layani. Se precisar de mais alguma coisa ou quiser tirar novas dúvidas, estou sempre por aqui à sua disposição. Tenha um dia maravilhoso e repleto de elegância! ✨🌸',
    dataHora: new Date().toISOString(),
  };

  sessao.mensagens.push(msgAgradecimento);
  sessao.ultimaMensagemEm = msgAgradecimento.dataHora;

  return res.json({
    sucesso: true,
    mensagem: 'Atendimento encerrado e status alterado para OFF.',
    sessao,
  });
});
