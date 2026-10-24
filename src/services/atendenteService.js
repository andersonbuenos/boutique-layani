/**
 * SERVIÃ‡O DE ATENDIMENTO VIRTUAL (FRONTEND) â€” BOUTIQUE LAYANI
 * Especialista: Cipher (Backend, SeguranÃ§a & Regras de NegÃ³cio)
 * 
 * Consome o motor determinÃ­stico unificado, garantindo consistÃªncia
 * absoluta com o backend e sem divergÃªncia de regras de negÃ³cio.
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

export function responderPergunta(pergunta, sessionId = 'default') {
  const resultado = processarAtendimento(pergunta, sessionId);
  return resultado.resposta;
}

