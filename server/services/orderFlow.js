/**
 * FLUXO COMERCIAL & PRÉ-PEDIDO DETERMINÍSTICO
 * Especialista: Cipher (Backend, Segurança & Regras de Negócio)
 * 
 * Processa a intenção de compra sem forjar reservas fictícias de banco
 * e sem inferir tamanhos sem confirmação expressa da cliente.
 */

import {
  LOJA_INFO,
  CATALOGO_PRODUTOS,
  formatarBRL,
} from './knowledgeBase.js';

export function processarFluxoPrePedido({
  produtoPrincipal,
  tamanhoIdentificado,
  sessao,
  intencoes,
}) {
  const prod =
    produtoPrincipal ||
    (sessao?.ultimoProdutoId
      ? CATALOGO_PRODUTOS.find((p) => p.id === sessao.ultimoProdutoId)
      : null);

  // 1. Não identificou o produto nem há no contexto da sessão
  if (!prod) {
    return {
      resposta:
        'Com certeza! Qual das nossas peças você gostaria de encomendar? Temos a Camiseta Algodão Egípcio, a Calça Jeans Skinny Flare e o Vestido Fluido Midi Dorama.',
      intencao: 'COMPRA_SOLICITAR_PRODUTO',
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // Atualiza produto no contexto
  if (sessao) {
    sessao.ultimoProdutoId = prod.id;
  }

  const tam = tamanhoIdentificado || (sessao?.ultimoProdutoId === prod.id ? sessao?.ultimoTamanho : null);

  // 2. Se a cliente NÃO informou o tamanho: NUNCA escolher padrão sem confirmação!
  if (!tam) {
    if (sessao) sessao.aguardandoTamanhoProdutoId = prod.id;
    return {
      resposta: `Excelente escolha! Para prepararmos o resumo da sua ${prod.nome}, por favor, qual tamanho você deseja? Nossa grade cadastrada para essa peça é: ${prod.tamanhoPadraoTexto}.`,
      intencao: 'COMPRA_SOLICITAR_TAMANHO',
      produto: prod.nome,
      encaminhadoHumano: false,
      linkWhatsapp: null,
    };
  }

  // 3. Validação do tamanho informado com a grade oficial cadastrada
  const tamanhoValido = prod.gradesValidas.includes(tam.toUpperCase());
  if (!tamanhoValido) {
    return {
      resposta: `Para a ${prod.nome}, trabalhamos exclusivamente com a grade cadastrada: ${prod.tamanhoPadraoTexto}. O tamanho "${tam}" não consta em nosso catálogo para este modelo. Gostaria de escolher um tamanho disponível ou falar com nossa consultora?`,
      intencao: 'TAMANHO_INVALIDO',
      produto: prod.nome,
      encaminhadoHumano: true,
      linkWhatsapp: LOJA_INFO.linkWhatsapp,
    };
  }

  // 4. Sucesso: constrói resumo de pré-pedido transparente
  if (sessao) {
    sessao.ultimoTamanho = tam;
    sessao.aguardandoTamanhoProdutoId = null;
  }

  const subtotal = prod.preco;
  const taxa = LOJA_INFO.taxaEntrega;
  const totalEstimado = subtotal + taxa;

  const temDuvidaEstoque = intencoes.includes('DUVIDA_ESTOQUE');
  const notaEstoque = temDuvidaEstoque
    ? ' A disponibilidade em tempo real precisa ser confirmada diretamente antes do fechamento.'
    : '';

  return {
    resposta: `Ótimo! Preparei o resumo da sua intenção de compra:\n\n• 1x ${prod.nome} (Tamanho: ${tam}) — ${formatarBRL(subtotal)}\n• Taxa de entrega fixa informada — ${formatarBRL(taxa)}\n• Total estimado: ${formatarBRL(totalEstimado)}\n\n${notaEstoque}Deseja que eu te encaminhe ao checkout para finalizar ou prefere atendimento com uma consultora?`,
    intencao: 'PRE_PEDIDO_GERADO',
    produto: prod.nome,
    tamanho: tam,
    totalEstimado,
    encaminhadoHumano: temDuvidaEstoque,
    linkWhatsapp: temDuvidaEstoque ? LOJA_INFO.linkWhatsapp : null,
  };
}
