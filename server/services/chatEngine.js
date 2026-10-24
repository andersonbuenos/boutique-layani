/**
 * MOTOR DE ATENDIMENTO VIRTUAL & CONSULTORIA COMERCIAL — BOUTIQUE LAYANI
 * Especialista: Cipher (Backend, Segurança & Regras de Negócio)
 * 
 * Orquestrador determinístico contextual de alta autonomia.
 */

import { RESPOSTA_ENCAMINHAMENTO_PADRAO } from './knowledgeBase.js';
import {
  normalizarTexto,
  identificarProdutos,
  identificarTamanho,
  identificarItemNaoCatalogado,
  classificarIntencoes,
} from './nluEngine.js';
import {
  obterSessao,
  atualizarSessao,
  limparSessao,
  redefinirTodasSessoes,
} from './sessionManager.js';
import { comporResposta } from './responseComposer.js';

export const RESPOSTA_ENCAMINHAMENTO = RESPOSTA_ENCAMINHAMENTO_PADRAO;
export { normalizarTexto, obterSessao, limparSessao, redefinirTodasSessoes };

export function processarAtendimento(pergunta, sessionId = 'default') {
  const normalizada = normalizarTexto(pergunta);

  if (!normalizada) {
    return {
      resposta: 'Por favor, digite sua dúvida para que eu possa orientar você.',
      intencao: 'VAZIA',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  const sessao = obterSessao(sessionId);

  // 1. Identificação de entidades
  const produtos = identificarProdutos(normalizada, sessao);
  const tamanhoIdentificado = identificarTamanho(normalizada);
  const itemNaoCatalogado = identificarItemNaoCatalogado(normalizada);

  // 2. Classificação de intenções (suporte a múltiplas intenções)
  const intencoes = classificarIntencoes(normalizada, produtos, sessao);

  // 3. Composição determinística da resposta
  const resultado = comporResposta({
    normalizada,
    intencoes,
    produtos,
    tamanhoIdentificado,
    itemNaoCatalogado,
    sessao,
  });

  // 4. Atualiza contexto da sessão
  atualizarSessao(sessionId, {
    ultimaIntencao: resultado.intencao,
  });

  return resultado;
}
