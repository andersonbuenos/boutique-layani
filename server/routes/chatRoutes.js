import { Router } from 'express';
import { processarAtendimento } from '../services/chatEngine.js';

export const chatRouter = Router();

// POST /api/chat - Atendimento virtual determinístico (SEM IA)
chatRouter.post('/', (req, res) => {
  const { mensagem, sessionId } = req.body || {};

  const resultado = processarAtendimento(mensagem, sessionId);

  return res.json({
    autor: 'assistente',
    texto: resultado.resposta,
    intencao: resultado.intencao,
    produto: resultado.produto || null,
    tamanho: resultado.tamanho || null,
    totalEstimado: resultado.totalEstimado || null,
    encaminhadoHumano: resultado.encaminhadoHumano,
    linkWhatsapp: resultado.linkWhatsapp,
    dataHora: new Date().toISOString(),
  });
});

