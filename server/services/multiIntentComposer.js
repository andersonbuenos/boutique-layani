/**
 * COMPOSITOR DE CONSULTAS COMPOSTAS & MÚLTIPLAS INTENÇÕES
 * Especialista: Cipher (Backend, Segurança & Regras de Negócio)
 */

import { LOJA_INFO, formatarBRL } from './knowledgeBase.js';

export function comporConsultasCompostas({ intencoes, produtos, produtoPrincipal }) {
  const partesResposta = [];
  let encaminharPorEstoqueOuPgto = false;

  if (intencoes.includes('PRECO')) {
    if (produtoPrincipal) {
      partesResposta.push(`${produtoPrincipal.nome} custa ${formatarBRL(produtoPrincipal.preco)}`);
    } else if (produtos.length > 1) {
      const listaPrecos = produtos.map((p) => `${p.nome}: ${formatarBRL(p.preco)}`).join(', ');
      partesResposta.push(`Os valores são: ${listaPrecos}`);
    } else {
      partesResposta.push('Nossas peças custam: Camiseta por R$ 39,90, Vestido por R$ 89,90 e Calça Jeans por R$ 119,90');
    }
  }

  if (intencoes.includes('GRADE_TAMANHOS')) {
    if (produtoPrincipal) {
      partesResposta.push(`possui grade cadastrada nos tamanhos ${produtoPrincipal.tamanhoPadraoTexto}`);
    } else {
      partesResposta.push('nossas grades são: Camiseta (P, M e G), Calça Jeans (36 ao 44) e Vestido (P e M)');
    }
  }

  if (intencoes.includes('TAXA_ENTREGA')) {
    partesResposta.push(`a taxa de entrega informada é de ${formatarBRL(LOJA_INFO.taxaEntrega)}`);
  }

  if (intencoes.includes('HORARIO')) {
    partesResposta.push(`A ${LOJA_INFO.nome} funciona de ${LOJA_INFO.diasFuncionamento}, das ${LOJA_INFO.horarioAbertura} às ${LOJA_INFO.horarioFechamento}.`);
  }

  if (intencoes.includes('DUVIDA_ESTOQUE')) {
    partesResposta.push('A disponibilidade em tempo real precisa ser confirmada diretamente com nossa equipe.');
    encaminharPorEstoqueOuPgto = true;
  }
  if (intencoes.includes('DUVIDA_PAGAMENTO')) {
    partesResposta.push('As opções e condições de pagamento são orientadas diretamente por nossa equipe.');
    encaminharPorEstoqueOuPgto = true;
  }

  if (partesResposta.length === 0) return null;

  // Cenário clássico de múltiplas intenções de produto (Preço + Tamanho + Entrega)
  if (produtoPrincipal && intencoes.includes('PRECO') && (intencoes.includes('GRADE_TAMANHOS') || intencoes.includes('TAXA_ENTREGA'))) {
    const subtotal = produtoPrincipal.preco;
    const taxa = LOJA_INFO.taxaEntrega;
    const totalEstimado = subtotal + (intencoes.includes('TAXA_ENTREGA') ? taxa : 0);

    let msg = `O ${produtoPrincipal.nome} custa ${formatarBRL(subtotal)}`;
    if (intencoes.includes('GRADE_TAMANHOS')) {
      msg += `, possui grade cadastrada nos tamanhos ${produtoPrincipal.tamanhoPadraoTexto}`;
    }
    if (intencoes.includes('TAXA_ENTREGA')) {
      msg += ` e a taxa de entrega informada é de ${formatarBRL(taxa)}. Considerando uma unidade e essa taxa, o total estimado fica em ${formatarBRL(totalEstimado)}`;
    } else {
      msg += '.';
    }
    msg += ' Quer que eu prepare um resumo do seu pedido?';

    return {
      resposta: msg,
      intencao: 'MULTINFORMACOES_PRODUTO',
      produto: produtoPrincipal.nome,
      encaminhadoHumano: encaminharPorEstoqueOuPgto,
      linkWhatsapp: encaminharPorEstoqueOuPgto ? LOJA_INFO.linkWhatsapp : null,
    };
  }

  const textoFinal = partesResposta.join('. ') + (encaminharPorEstoqueOuPgto ? ' Posso te conectar ao nosso WhatsApp para verificar?' : '');
  return {
    resposta: textoFinal.endsWith('.') ? textoFinal : `${textoFinal}.`,
    intencao: 'CONSULTA_COMPOSTA',
    produto: produtoPrincipal?.nome || null,
    encaminhadoHumano: encaminharPorEstoqueOuPgto,
    linkWhatsapp: encaminharPorEstoqueOuPgto ? LOJA_INFO.linkWhatsapp : null,
  };
}
