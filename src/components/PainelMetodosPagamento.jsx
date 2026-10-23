import React from 'react';
import { formatarPreco } from '../data/boutiqueData';

export default function PainelMetodosPagamento({
  formaPagamento,
  setFormaPagamento,
  total,
  parcelas,
  setParcelas,
  trocoPara,
  setTrocoPara,
  chaveCopiada,
  onCopiarPix,
}) {
  return (
    <div className="checkout-secao">
      <label className="checkout-label">3. Forma de Pagamento</label>
      <div className="formas-pagamento-grid">
        <button
          type="button"
          className={`btn-forma-pag ${formaPagamento === 'pix' ? 'selecionado' : ''}`}
          onClick={() => setFormaPagamento('pix')}
        >
          <span>💠</span><span>PIX (Instantâneo)</span>
        </button>
        <button
          type="button"
          className={`btn-forma-pag ${formaPagamento === 'cartao' ? 'selecionado' : ''}`}
          onClick={() => setFormaPagamento('cartao')}
        >
          <span>💳</span><span>Cartão de Crédito</span>
        </button>
        <button
          type="button"
          className={`btn-forma-pag ${formaPagamento === 'entrega_dinheiro' ? 'selecionado' : ''}`}
          onClick={() => setFormaPagamento('entrega_dinheiro')}
        >
          <span>💵</span><span>Pagar na Entrega (Dinheiro)</span>
        </button>
        <button
          type="button"
          className={`btn-forma-pag ${formaPagamento === 'entrega_cartao' ? 'selecionado' : ''}`}
          onClick={() => setFormaPagamento('entrega_cartao')}
        >
          <span>📱</span><span>Pagar na Entrega (Maquininha)</span>
        </button>
      </div>

      <div className="painel-pagamento-detalhe">
        {formaPagamento === 'pix' && (
          <div className="pix-box">
            <div className="qr-code-ilustrado">
              <span>📱</span>
              <span className="qr-code-rotulo">QR Code PIX</span>
            </div>
            <div className="pix-chave-campo">
              <input type="text" readOnly value="5567991012354" className="pix-chave-input" />
              <button type="button" className="btn-copiar-pix" onClick={onCopiarPix}>
                {chaveCopiada ? 'Copiado! ✓' : 'Copiar Chave'}
              </button>
            </div>
          </div>
        )}

        {formaPagamento === 'cartao' && (
          <div className="cartao-form-grid">
            <input type="text" placeholder="Número do Cartão" defaultValue="4532 •••• •••• 7412" className="input-cartao" />
            <input type="text" placeholder="Validade" defaultValue="11/29" className="input-cartao" />
            <input type="text" placeholder="CVV" defaultValue="884" className="input-cartao" />
            <select className="select-parcelas" value={parcelas} onChange={(e) => setParcelas(e.target.value)}>
              <option value="1">1x de {formatarPreco(total)} (sem juros)</option>
              <option value="2">2x de {formatarPreco(total / 2)} (sem juros)</option>
              <option value="3">3x de {formatarPreco(total / 3)} (sem juros)</option>
              <option value="6">6x de {formatarPreco(total / 6)} (sem juros)</option>
            </select>
          </div>
        )}

        {formaPagamento === 'entrega_dinheiro' && (
          <div className="entrega-box">
            <label style={{ fontSize: '0.85rem' }}>Precisa de troco para quanto?</label>
            <input
              type="number"
              value={trocoPara}
              onChange={(e) => setTrocoPara(e.target.value)}
              placeholder="Ex: 150.00"
              className="input-cartao"
            />
            <span style={{ fontSize: '0.8rem', color: '#166534' }}>
              O entregador levará R$ {Math.max(0, Number(trocoPara) - total).toFixed(2)} de troco.
            </span>
          </div>
        )}

        {formaPagamento === 'entrega_cartao' && (
          <div className="entrega-box">
            <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
              O entregador levará a maquininha móvel (Débito, Crédito e aproximação).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
