import React from 'react';
import { PRODUTOS, formatarPreco, LOJA } from '../data/boutiqueData';
import PainelMetodosPagamento from './PainelMetodosPagamento';

const tamanhosPorProduto = {
  1: ['P', 'M', 'G'],
  2: ['36', '38', '40', '42', '44'],
  3: ['P', 'M'],
};

export default function FormularioVenda({
  produtoSel,
  setProdutoSel,
  tamanhoSel,
  setTamanhoSel,
  formaPagamento,
  setFormaPagamento,
  parcelas,
  setParcelas,
  trocoPara,
  setTrocoPara,
  chaveCopiada,
  onCopiarPix,
  carregando,
  onSubmit,
}) {
  const subtotal = produtoSel.preco;
  const taxaEntrega = LOJA.taxaEntrega || 10.0;
  const total = subtotal + taxaEntrega;

  return (
    <form className="checkout-corpo" onSubmit={onSubmit}>
      <div className="checkout-secao">
        <label className="checkout-label">1. Escolha a Peça</label>
        <div className="produtos-chips">
          {PRODUTOS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`btn-produto-chip ${produtoSel.id === p.id ? 'selecionado' : ''}`}
              onClick={() => {
                setProdutoSel(p);
                setTamanhoSel(tamanhosPorProduto[p.id][0]);
              }}
            >
              <span className="chip-prod-nome">{p.nome}</span>
              <strong className="chip-prod-preco">{formatarPreco(p.preco)}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="checkout-secao">
        <label className="checkout-label">2. Escolha o Tamanho</label>
        <div className="tamanhos-selector">
          {tamanhosPorProduto[produtoSel.id].map((tam) => (
            <button
              key={tam}
              type="button"
              className={`btn-tam-chip ${tamanhoSel === tam ? 'selecionado' : ''}`}
              onClick={() => setTamanhoSel(tam)}
            >
              Tam {tam}
            </button>
          ))}
        </div>
      </div>

      <PainelMetodosPagamento
        formaPagamento={formaPagamento}
        setFormaPagamento={setFormaPagamento}
        total={total}
        parcelas={parcelas}
        setParcelas={setParcelas}
        trocoPara={trocoPara}
        setTrocoPara={setTrocoPara}
        chaveCopiada={chaveCopiada}
        onCopiarPix={onCopiarPix}
      />

      <div className="resumo-valores-caixa">
        <div className="resumo-linha">
          <span>{produtoSel.nome} (Tam {tamanhoSel}):</span>
          <strong>{formatarPreco(subtotal)}</strong>
        </div>
        <div className="resumo-linha">
          <span>Taxa de Entrega:</span>
          <strong>{formatarPreco(taxaEntrega)}</strong>
        </div>
        <div className="resumo-linha total">
          <span>Total:</span>
          <span>{formatarPreco(total)}</span>
        </div>
      </div>

      <button type="submit" className="btn-confirmar-venda-final" disabled={carregando}>
        {carregando ? 'Processando Fechamento...' : '✓ Confirmar e Fechar Venda Agora'}
      </button>
    </form>
  );
}
