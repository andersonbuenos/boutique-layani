/**
 * MOTOR DE LINGUAGEM NATURAL DETERMINÍSTICO (NLU)
 * Especialista: Cipher (Backend, Segurança & Regras de Negócio)
 */

import {
  CATALOGO_PRODUTOS,
  PRODUTOS_NAO_CATALOGADOS_ALTERNATIVAS,
} from './knowledgeBase.js';
import { classificarIntencoes, detectarDesvioEscopo } from './intentDetector.js';

export { classificarIntencoes, detectarDesvioEscopo };

export function normalizarTexto(texto) {
  if (!texto || typeof texto !== 'string') return '';
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function identificarProdutos(normalizada, sessao = null) {
  const encontrados = [];

  for (const prod of CATALOGO_PRODUTOS) {
    const mencaoDireta = prod.sinonimos.some((sin) => {
      const regex = new RegExp(`\\b${sin}\\b`, 'i');
      return regex.test(normalizada);
    });

    if (mencaoDireta) {
      encontrados.push(prod);
    }
  }

  // Resolução Anafórica / Contextual
  if (encontrados.length === 0 && sessao && (sessao.ultimoProdutoId || sessao.aguardandoTamanhoProdutoId)) {
    // Não herdar produto se for pergunta direta sobre taxa de entrega ou horário da loja
    const ehPoliticaGeral =
      /\b(entrega|frete|horario|funcionamento)\b/.test(normalizada) &&
      !/\b(dele|dela|desse|dessa|daquele|daquela|do\s+vestido|da\s+calca|da\s+camiseta)\b/.test(normalizada);

    if (!ehPoliticaGeral) {
      const padroesReferencia = [
        /\b(dele|dela|desse|dessa|daquele|daquela|aquele|aquela|o\s+mesmo|a\s+mesma|essa\s+peca|esse\s+produto|a\s+roupa)\b/,
        /^(e\s+o\s+preco|quais\s+tamanhos|quais\s+os\s+tamanhos|e\s+quais\s+tamanhos|e\s+os\s+tamanhos|tem\s+que\s+tamanho|quanto\s+fica|quero\s+esse|vou\s+levar|quero\s+ela|quero\s+ele)/,

        /^(p|m|g|36|38|40|42|44)$/,
        /^(quero\s+(o\s+|a\s+)?(p|m|g|36|38|40|42|44))$/,
      ];

      const temReferencia = padroesReferencia.some((r) => r.test(normalizada));
      if (temReferencia || sessao.aguardandoTamanhoProdutoId) {
        const prodId = sessao.aguardandoTamanhoProdutoId || sessao.ultimoProdutoId;
        const prodContexto = CATALOGO_PRODUTOS.find((p) => p.id === prodId);
        if (prodContexto) {
          encontrados.push(prodContexto);
        }
      }
    }
  }


  return encontrados;
}

export function identificarTamanho(normalizada) {
  // Letras: P, M, G (evitar falso positivo com 'gangnam')
  if (/\b(tamanho|tam)?\s*g\b/.test(normalizada) && !/\bgangnam\b/.test(normalizada)) {
    return 'G';
  }
  if (/\b(tamanho|tam)?\s*m\b/.test(normalizada) && !/\bmidi\b/.test(normalizada)) {
    return 'M';
  }
  if (/\b(tamanho|tam)?\s*p\b/.test(normalizada)) {
    return 'P';
  }

  // Numerações de calça: 36 a 44
  const matchNum = normalizada.match(/\b(36|38|40|42|44)\b/);
  if (matchNum) {
    return matchNum[1];
  }

  return null;
}

export function identificarItemNaoCatalogado(normalizada) {
  for (const item of PRODUTOS_NAO_CATALOGADOS_ALTERNATIVAS) {
    const encontrou = item.termos.some((t) => new RegExp(`\\b${t}\\b`, 'i').test(normalizada));
    if (encontrou) {
      return item;
    }
  }
  return null;
}
