/**
 * MÓDULO DE CONSULTORIA DE MODA & ESTILO DORAMA
 * Especialista: Cipher (Backend, Segurança & Regras de Negócio)
 * 
 * Recomendações e composições estritamente baseadas nas peças oficiais cadastradas.
 */

import { CATALOGO_PRODUTOS } from './knowledgeBase.js';

export function gerarConsultoriaModa(normalizada, itemNaoCatalogado = null) {
  // 1. Se perguntou por peça não catalogada com alternativa sugerida
  if (itemNaoCatalogado) {
    if (itemNaoCatalogado.sugestaoProdutoId) {
      const prodSugerido = CATALOGO_PRODUTOS.find((p) => p.id === itemNaoCatalogado.sugestaoProdutoId);
      return `${itemNaoCatalogado.explicacao} Mas posso te apresentar nosso ${prodSugerido.nome}, que ${itemNaoCatalogado.motivoSugestao} Gostaria de conhecer os detalhes dele?`;
    }
    return itemNaoCatalogado.explicacao;
  }

  // 2. Looks para encontros românticos / jantares / vibe romântica de dorama
  if (/\b(encontro|jantar|romantico|romantica|date|namorado|especial|baile|gala)\b/.test(normalizada)) {
    const vestido = CATALOGO_PRODUTOS.find((p) => p.id === 3);
    return `Para ocasiões românticas e jantares, nossa principal recomendação é o ${vestido.nome} (R$ ${vestido.preco.toFixed(2).replace('.', ',')}). Ele possui modelagem acinturada, comprimento midi e tecido com caimento fluido impecável, traduzindo com perfeição a delicadeza dos k-dramas. Disponível nos tamanhos ${vestido.tamanhoPadraoTexto}.`;
  }

  // 3. Looks para trabalho / profissional / reunião / urbano
  if (/\b(trabalho|escritorio|reuniao|formal|profissional|urbano|gangnam)\b/.test(normalizada)) {
    const calca = CATALOGO_PRODUTOS.find((p) => p.id === 2);
    const camiseta = CATALOGO_PRODUTOS.find((p) => p.id === 1);
    return `Para o ambiente de trabalho e compromissos urbanos elegantes, a ${calca.nome} (R$ ${calca.preco.toFixed(2).replace('.', ',')}) é a escolha ideal. Com corte skinny flare e lycra premium, ela modela a silhueta com total conforto. Você pode combiná-la perfeitamente com a ${camiseta.nome} (R$ ${camiseta.preco.toFixed(2).replace('.', ',')}), criando uma composição moderna e sofisticada.`;
  }

  // 4. Looks casuais / dia a dia / passeio descontraído
  if (/\b(casual|dia\s+a\s+dia|passeio|confortavel|conforto|descontraido|cinema|parque|shopping)\b/.test(normalizada)) {
    const camiseta = CATALOGO_PRODUTOS.find((p) => p.id === 1);
    const calca = CATALOGO_PRODUTOS.find((p) => p.id === 2);
    return `Para o dia a dia e passeios casuais, a combinação perfeita é a ${camiseta.nome} (R$ ${camiseta.preco.toFixed(2).replace('.', ',')}) em 100% algodão nobre com a ${calca.nome} (R$ ${calca.preco.toFixed(2).replace('.', ',')}). É o visual clássico e despretensioso das protagonistas de doramas: leve, elegante e muito confortável!`;
  }

  // 5. Combinação entre peças do catálogo
  if (/\b(combinar|combina|combinacao|conjunto|compor)\b/.test(normalizada)) {
    return `Nossa sugestão oficial de combinação é o conjunto composto pela Camiseta Algodão Egípcio (R$ 39,90) e a Calça Jeans Skinny Flare (R$ 119,90). O toque suave do algodão aliado ao caimento estruturado da calça flare cria um look equilibrado e contemporâneo. Já o Vestido Fluido Midi Dorama (R$ 89,90) brilha como peça única em propostas mais românticas.`;
  }

  // 6. Consultoria genérica sobre estilo dorama
  return `Nosso catálogo foi cuidadosamente desenhado com inspiração na alta costura e na estética dos doramas contemporâneos. Temos o Vestido Fluido Midi (ideal para encontros românticos), a Calça Jeans Skinny Flare (elegância urbana com caimento impecável) e a Camiseta Algodão Egípcio (conforto casual refinado). Qual proposta combina mais com você hoje?`;
}
