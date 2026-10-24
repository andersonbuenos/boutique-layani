/**
 * COMPOSITOR DE RESPOSTAS & REGRAS DE NEGÓCIO
 * Especialista: Cipher (Backend, Segurança & Regras de Negócio)
 */

import {
  LOJA_INFO,
  RESPOSTA_ENCAMINHAMENTO_PADRAO,
  RESPOSTA_DESVIO_ESCOPO,
} from './knowledgeBase.js';
import { gerarConsultoriaModa } from './fashionAdvisor.js';
import { processarFluxoPrePedido } from './orderFlow.js';
import { comporConsultasCompostas } from './multiIntentComposer.js';

export function comporResposta({
  normalizada,
  intencoes,
  produtos,
  tamanhoIdentificado,
  itemNaoCatalogado,
  sessao,
}) {
  const produtoPrincipal = produtos.length > 0 ? produtos[0] : null;

  if (produtoPrincipal && sessao) {
    sessao.ultimoProdutoId = produtoPrincipal.id;
  }

  // 1. Guardrail estrito contra desvio de escopo
  if (intencoes.includes('DESVIO_ESCOPO')) {
    return {
      resposta: RESPOSTA_DESVIO_ESCOPO,
      intencao: 'DESVIO_ESCOPO',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 2. Caso específico contratual: Calça tamanho G (inexistente na grade de calças 36-44)
  if (normalizada.includes('calca') && (normalizada.includes('tamanho g') || normalizada.includes('tam g'))) {
    return {
      resposta: RESPOSTA_ENCAMINHAMENTO_PADRAO,
      intencao: 'ENCAMINHAMENTO_HUMANO',
      encaminhadoHumano: true,
      linkWhatsapp: LOJA_INFO.linkWhatsapp,
    };
  }

  // 3. Item não catalogado (calçados / acessórios) sem produto correspondente
  if (itemNaoCatalogado && itemNaoCatalogado.sugestaoProdutoId === null && intencoes.length <= 1) {
    return {
      resposta: RESPOSTA_ENCAMINHAMENTO_PADRAO,
      intencao: 'ENCAMINHAMENTO_HUMANO',
      encaminhadoHumano: true,
      linkWhatsapp: LOJA_INFO.linkWhatsapp,
    };
  }

  // 4. Dúvidas puras de encaminhamento restrito
  const ehDuvidaRestritaPura =
    !itemNaoCatalogado &&
    intencoes.some((i) => ['DUVIDA_ESTOQUE', 'DUVIDA_PAGAMENTO', 'DUVIDA_PRAZO', 'DUVIDA_TROCA'].includes(i)) &&
    !intencoes.includes('PRECO') &&
    !intencoes.includes('GRADE_TAMANHOS') &&
    !intencoes.includes('TAXA_ENTREGA') &&
    !intencoes.includes('COMPRA_PRE_PEDIDO') &&
    !intencoes.includes('CONSULTORIA_MODA');


  if (ehDuvidaRestritaPura) {
    return {
      resposta: RESPOSTA_ENCAMINHAMENTO_PADRAO,
      intencao: 'ENCAMINHAMENTO_HUMANO',
      encaminhadoHumano: true,
      linkWhatsapp: LOJA_INFO.linkWhatsapp,
    };
  }

  // 5. Intenção Comercial / Pré-Pedido
  if (intencoes.includes('COMPRA_PRE_PEDIDO')) {
    return processarFluxoPrePedido({
      produtoPrincipal,
      tamanhoIdentificado,
      sessao,
      intencoes,
    });
  }

  // 6. Consultoria de Moda / Ocasiões / Alternativas
  if (intencoes.includes('CONSULTORIA_MODA') || itemNaoCatalogado) {
    const textoModa = gerarConsultoriaModa(normalizada, itemNaoCatalogado);
    return {
      resposta: textoModa,
      intencao: 'CONSULTORIA_MODA',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 7. Múltiplas Intenções ou Consultas Combinadas
  const resultadoComposto = comporConsultasCompostas({ intencoes, produtos, produtoPrincipal });
  if (resultadoComposto) {
    return resultadoComposto;
  }

  // 8. Catálogo geral
  if (intencoes.includes('CATALOGO_GERAL')) {
    return {
      resposta: 'Temos 3 peças exclusivas disponíveis em nosso catálogo:\n\n1. Camiseta Algodão Egípcio — R$ 39,90 (Tamanhos: P, M e G)\n2. Calça Jeans Skinny Flare — R$ 119,90 (Tamanhos: 36 ao 44)\n3. Vestido Fluido Midi Dorama — R$ 89,90 (Tamanhos: P e M)\n\nQual delas você gostaria de conhecer em detalhes ou adicionar ao seu pedido?',
      intencao: 'CATALOGO_GERAL',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 9. Reversão de Cancelamento
  if (intencoes.includes('REVERSAO_CANCELAMENTO')) {
    return {
      resposta: 'Lamentamos que esteja pensando em desistir da sua compra! O que houve com seu pedido? Posso verificar uma cortesia de frete grátis para você ou chamar uma de nossas consultoras agora mesmo.',
      intencao: 'REVERSAO_CANCELAMENTO',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 10. Saudações
  if (intencoes.includes('SAUDACAO')) {
    return {
      resposta: `Olá! Sou a consultora virtual da ${LOJA_INFO.nome}. Posso apresentar nossas peças inspiradas em doramas, indicar tamanhos, valores ou preparar o resumo da sua compra. Como posso te atender hoje?`,
      intencao: 'SAUDACAO',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 11. Agradecimento
  if (intencoes.includes('AGRADECIMENTO')) {
    return {
      resposta: `Por nada! Se precisar de qualquer outra consultoria sobre as peças da ${LOJA_INFO.nome}, estou à sua inteira disposição.`,
      intencao: 'AGRADECIMENTO',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 12. Fallback padrão seguro
  return {
    resposta: RESPOSTA_ENCAMINHAMENTO_PADRAO,
    intencao: 'DESCONHECIDO',
    encaminhadoHumano: true,
    linkWhatsapp: LOJA_INFO.linkWhatsapp,
  };
}
