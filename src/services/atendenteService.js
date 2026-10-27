/**
 * SERVIÇO DE ATENDIMENTO VIRTUAL (FRONTEND) — BOUTIQUE LAYANI
 * Especialistas: Cipher (Backend, Segurança) e Nova (Experiência & Tom de Voz)
 * 
 * Suporta atendimento via Groq AI (/api/chat) com fallback
 * síncrono para o motor determinístico em testes ou contingência.
 */

import {
  processarAtendimento,
  normalizarTexto,
  RESPOSTA_ENCAMINHAMENTO,
  obterSessao,
  limparSessao,
  redefinirTodasSessoes,
} from '../../server/services/chatEngine.js';

export {
  normalizarTexto,
  RESPOSTA_ENCAMINHAMENTO,
  obterSessao,
  limparSessao,
  redefinirTodasSessoes,
  processarAtendimento,
};

/**
 * Resposta síncrona determinística (usada nos testes e offline)
 */
export function responderPergunta(pergunta, sessionId = 'default') {
  const resultado = processarAtendimento(pergunta, sessionId);
  return resultado.resposta;
}

/**
 * Consulta assíncrona completa retornando texto e metadados do pedido
 */
export async function consultarAssistenteCompletoAsync(pergunta, sessionId = 'default', historico = []) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem: pergunta, sessionId, historico }),
    });

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    const data = await response.json();
    return {
      texto: data?.texto || responderPergunta(pergunta, sessionId),
      intencao: data?.intencao,
      itens: data?.itens || null,
      totalEstimado: data?.totalEstimado || null,
      encaminhadoHumano: data?.encaminhadoHumano || false,
      linkWhatsapp: data?.linkWhatsapp || null,
    };
  } catch (error) {
    const fallbackTxt = responderPergunta(pergunta, sessionId);
    return {
      texto: fallbackTxt,
      intencao: 'FALLBACK',
      itens: null,
      totalEstimado: null,
      encaminhadoHumano: false,
    };
  }
}

/**
 * Resposta assíncrona inteligente conectada à API do Assistente Groq
 */
export async function responderPerguntaAsync(pergunta, sessionId = 'default', historico = []) {
  const res = await consultarAssistenteCompletoAsync(pergunta, sessionId, historico);
  return res.texto;
}



