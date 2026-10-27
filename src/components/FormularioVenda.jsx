import React, { useState } from 'react';
import { PRODUTOS, formatarPreco, LOJA } from '../data/boutiqueData';
import PainelMetodosPagamento from './PainelMetodosPagamento';

export default function FormularioVenda({
  itensCarrinho,
  setItensCarrinho,
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
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false);

  const subtotal = itensCarrinho.reduce(
    (acc, it) => acc + it.precoUnitario * it.quantidade,
    0
  );
  const taxaEntrega = LOJA.taxaEntrega || 10.0;
  const total = subtotal + taxaEntrega;

  const alterarQtd = (index, delta) => {
    setItensCarrinho((prev) => {
      const novo = [...prev];
      const novaQtd = novo[index].quantidade + delta;
      if (novaQtd > 0) novo[index].quantidade = novaQtd;
      return novo;
    });
  };

  const alterarTamanho = (index, tam) => {
    setItensCarrinho((prev) => {
      const novo = [...prev];
      novo[index].tamanho = tam;
      return novo;
    });
  };

  const removerItem = (index) => {
    setItensCarrinho((prev) => prev.filter((_, i) => i !== index));
  };

  const adicionarProduto = (p) => {
    const grades = p.tamanhos || ['P', 'M', 'G'];
    setItensCarrinho((prev) => [
      ...prev,
      {
        produtoId: p.id,
        nome: p.nomeCompleto || p.nome,
        precoUnitario: p.preco,
        quantidade: 1,
        tamanho: grades[0] || 'M',
        tamanhosDisponiveis: grades,
      },
    ]);
    setMostrarCatalogo(false);
  };

  return (
    <form className="checkout-corpo" onSubmit={onSubmit}>
      <div className="checkout-secao">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label className="checkout-label">1. Peças do Pedido ({itensCarrinho.length})</label>
          <button
            type="button"
            style={{
              background: '#fdf2f8',
              border: '1px solid #fbcfe8',
              color: 'var(--color-primary)',
              borderRadius: '20px',
              padding: '0.2rem 0.65rem',
              fontSize: '0.75rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => setMostrarCatalogo(!mostrarCatalogo)}
          >
            {mostrarCatalogo ? '✕ Fechar Lista' : '+ Adicionar Peças'}
          </button>
        </div>

        {mostrarCatalogo && (
          <div style={{
            background: '#fdfafb',
            border: '1px solid #fad5df',
            borderRadius: '8px',
            padding: '0.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
            gap: '0.4rem',
            maxHeight: '140px',
            overflowY: 'auto',
          }}>
            {PRODUTOS.map((p) => (
              <button
                key={p.id}
                type="button"
                className="btn-produto-chip"
                onClick={() => adicionarProduto(p)}
                style={{ textAlign: 'left', padding: '0.4rem' }}
              >
                <span className="chip-prod-nome" style={{ fontSize: '0.78rem' }}>{p.nomeCompleto || p.nome}</span>
                <strong className="chip-prod-preco">{formatarPreco(p.preco)}</strong>
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
          {itensCarrinho.map((item, idx) => {
            const pRef = PRODUTOS.find((p) => p.id === item.produtoId);
            const grades = item.tamanhosDisponiveis || pRef?.tamanhos || ['P', 'M', 'G'];

            return (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#fafaf9',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  padding: '0.55rem 0.8rem',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ flex: '1 1 150px' }}>
                  <strong style={{ display: 'block', fontSize: '0.85rem', color: '#1e293b' }}>
                    {item.nome}
                  </strong>
                  <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                    {formatarPreco(item.precoUnitario)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Tam:</span>
                  <select
                    value={item.tamanho}
                    onChange={(e) => alterarTamanho(idx, e.target.value)}
                    style={{
                      padding: '0.15rem 0.35rem',
                      borderRadius: '4px',
                      border: '1px solid #cbd5e1',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      background: '#fff',
                    }}
                  >
                    {grades.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <button type="button" onClick={() => alterarQtd(idx, -1)} style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>-</button>
                  <span style={{ minWidth: '16px', textAlign: 'center', fontWeight: 700, fontSize: '0.82rem' }}>{item.quantidade}</span>
                  <button type="button" onClick={() => alterarQtd(idx, 1)} style={{ width: '22px', height: '22px', borderRadius: '4px', border: '1px solid #cbd5e1', cursor: 'pointer' }}>+</button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>
                    {formatarPreco(item.precoUnitario * item.quantidade)}
                  </strong>
                  {itensCarrinho.length > 1 && (
                    <button type="button" onClick={() => removerItem(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.95rem' }}>✕</button>
                  )}
                </div>
              </div>
            );
          })}
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
          <span>Subtotal das Peças ({itensCarrinho.reduce((a, b) => a + b.quantidade, 0)} un):</span>
          <strong>{formatarPreco(subtotal)}</strong>
        </div>
        <div className="resumo-linha">
          <span>Taxa Fixa de Entrega:</span>
          <strong>{formatarPreco(taxaEntrega)}</strong>
        </div>
        <div className="resumo-linha total">
          <span>Valor Total Conectado:</span>
          <span style={{ fontSize: '1.25rem', color: 'var(--color-primary)' }}>{formatarPreco(total)}</span>
        </div>
      </div>

      <button
        type="submit"
        className="btn-confirmar-venda-final"
        disabled={carregando || itensCarrinho.length === 0}
      >
        {carregando
          ? 'Processando Fechamento...'
          : `✓ Validar Comprovante e Fechar Venda (${formatarPreco(total)})`}
      </button>
    </form>
  );
}
