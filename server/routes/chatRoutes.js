import { Router } from 'express';
import { processarAtendimento } from '../services/chatEngine.js';

export const chatRouter = Router();

// POST /api/chat - Atendimento virtual determinístico (SEM IA)
chatRouter.post('/', (req, res) => {
  const { mensagem } = req.body || {};

  const resultado = processarAtendimento(mensagem);

  return res.json({
    autor: 'assistente',
    texto: resultado.resposta,
    intencao: resultado.intencao,
    encaminhadoHumano: resultado.encaminhadoHumano,
    linkWhatsapp: resultado.linkWhatsapp,
    dataHora: new Date().toISOString(),
  });
});
