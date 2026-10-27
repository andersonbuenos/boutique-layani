import { Router } from 'express';
import { processarMensagemAssistente } from '../services/groqService.js';

export const chatRouter = Router();

// POST /api/chat - Atendimento virtual com Groq AI & Fallback Resiliente
chatRouter.post('/', async (req, res) => {
  try {
    const { mensagem, sessionId, historico } = req.body || {};

    const resultado = await processarMensagemAssistente({
      mensagem,
      sessionId,
      historico,
    });

    return res.json(resultado);
  } catch (error) {
    return res.status(500).json({
      autor: 'assistente',
      texto: 'Olá! Tive um pequeno instante de instabilidade, mas estou pronta para te atender. O que gostaria de saber sobre nossas peças?',
      erro: error.message,
    });
  }
});


