import { describe, it, expect, beforeEach } from 'vitest';
import {
  processarAtendimento,
  limparSessao,
  redefinirTodasSessoes,
  RESPOSTA_ENCAMINHAMENTO,
} from '../services/chatEngine.js';

describe('Suíte 1: NLU, Múltiplas Intenções, Memória & Isolamento (25 Cenários)', () => {
  beforeEach(() => {
    redefinirTodasSessoes();
  });

  // BLOCO 1: Variações linguísticas e sinônimos (6 cenários)
  describe('Bloco 1: Variações linguísticas e sinônimos', () => {
    it('Cenário 1: "Qual o valor daquele midi?" -> Vestido Fluido Midi (R$ 89,90)', () => {
      const res = processarAtendimento('Qual o valor daquele midi?', 's-1');
      expect(res.resposta).toContain('Vestido Fluido Midi Dorama');
      expect(res.resposta).toContain('89,90');
      expect(res.encaminhadoHumano).toBe(false);
    });

    it('Cenário 2: "Esse vestido sai por quanto?" -> preço do vestido', () => {
      const res = processarAtendimento('Esse vestido sai por quanto?', 's-2');
      expect(res.resposta).toContain('89,90');
    });

    it('Cenário 3: "É caro o jeans flare?" -> Calça Jeans Skinny Flare (R$ 119,90)', () => {
      const res = processarAtendimento('É caro o jeans flare?', 's-3');
      expect(res.resposta).toContain('Calça Jeans Skinny Flare');
      expect(res.resposta).toContain('119,90');
    });

    it('Cenário 4: "Me fala o preço da t-shirt de algodão egípcio"', () => {
      const res = processarAtendimento('Me fala o preço da t-shirt de algodão egípcio', 's-4');
      expect(res.resposta).toContain('Camiseta Algodão Egípcio');
      expect(res.resposta).toContain('39,90');
    });

    it('Cenário 5: "Quanto tá a blusinha?" -> reconhece camiseta', () => {
      const res = processarAtendimento('Quanto tá a blusinha?', 's-5');
      expect(res.resposta).toContain('39,90');
    });

    it('Cenário 6: "Valores da calça skinny flare" -> informa R$ 119,90', () => {
      const res = processarAtendimento('Valores da calça skinny flare', 's-6');
      expect(res.resposta).toContain('119,90');
    });
  });

  // BLOCO 2: Múltiplas intenções combinadas (5 cenários)
  describe('Bloco 2: Múltiplas intenções combinadas', () => {
    it('Cenário 7: Preço + Tamanhos + Taxa de Entrega combinados', () => {
      const res = processarAtendimento(
        'Quanto custa o vestido, quais tamanhos vocês trabalham e quanto fica a entrega?',
        's-7'
      );
      expect(res.resposta).toContain('Vestido Fluido Midi Dorama');
      expect(res.resposta).toContain('89,90');
      expect(res.resposta).toContain('P e M');
      expect(res.resposta).toContain('10,00');
      expect(res.resposta).toContain('99,90');
      expect(res.resposta).toContain('resumo do seu pedido');
    });

    it('Cenário 8: Calça jeans + taxa de frete combinados', () => {
      const res = processarAtendimento('Qual o valor da calça jeans e qual o frete?', 's-8');
      expect(res.resposta).toContain('119,90');
      expect(res.resposta).toContain('10,00');
      expect(res.resposta).toContain('129,90');
    });

    it('Cenário 9: Preço e tamanhos da camiseta', () => {
      const res = processarAtendimento('Quais tamanhos da camiseta e quanto custa?', 's-9');
      expect(res.resposta).toContain('39,90');
      expect(res.resposta).toContain('P, M e G');
    });

    it('Cenário 10: Horário e taxa de entrega combinados', () => {
      const res = processarAtendimento('Qual o horário da loja e quanto custa a entrega?', 's-10');
      expect(res.resposta).toContain('segunda a sábado');
      expect(res.resposta).toContain('8h');
      expect(res.resposta).toContain('18h');
      expect(res.resposta).toContain('10,00');
    });

    it('Cenário 11: Preço do vestido e horário de funcionamento', () => {
      const res = processarAtendimento('Preço do vestido e horário de funcionamento', 's-11');
      expect(res.resposta).toContain('89,90');
      expect(res.resposta).toContain('segunda a sábado');
    });
  });
  // BLOCO 3: Memória de conversação e contexto sequencial (5 cenários)
  describe('Bloco 3: Memória de conversação e contexto sequencial', () => {
    it('Cenário 12: Diálogo completo: preço -> tamanhos -> escolha de número', () => {
      const sId = 'sessao-seq-12';
      const r1 = processarAtendimento('Quanto custa a calça?', sId);
      expect(r1.resposta).toContain('119,90');

      const r2 = processarAtendimento('E quais tamanhos?', sId);
      expect(r2.resposta).toContain('36, 38, 40, 42 e 44');

      const r3 = processarAtendimento('Quero a 40.', sId);
      expect(r3.resposta).toContain('Calça Jeans Skinny Flare');
      expect(r3.resposta).toContain('Tamanho: 40');
      expect(r3.resposta).toContain('129,90');
    });

    it('Cenário 13: Anáfora "dele" referenciando o vestido', () => {
      const sId = 'sessao-seq-13';
      processarAtendimento('Gostei do vestido midi.', sId);
      const r2 = processarAtendimento('Qual o valor dele?', sId);
      expect(r2.resposta).toContain('Vestido Fluido Midi Dorama');
      expect(r2.resposta).toContain('89,90');
    });

    it('Cenário 14: Anáfora "dela" referenciando a camiseta', () => {
      const sId = 'sessao-seq-14';
      processarAtendimento('Gostei da camiseta básica.', sId);
      const r2 = processarAtendimento('Quais os tamanhos dela?', sId);
      expect(r2.resposta).toContain('P, M e G');
    });

    it('Cenário 15: Pergunta geral sobre entrega após produto não força combo incorreto', () => {
      const sId = 'sessao-seq-15';
      processarAtendimento('Quanto custa a calça?', sId);
      const r2 = processarAtendimento('Qual o valor da entrega?', sId);
      expect(r2.resposta).toContain('10,00');
    });

    it('Cenário 16: Continuidade de compra após assistente solicitar tamanho', () => {
      const sId = 'sessao-seq-16';
      const r1 = processarAtendimento('Quero comprar o vestido', sId);
      expect(r1.intencao).toBe('COMPRA_SOLICITAR_TAMANHO');

      const r2 = processarAtendimento('Tamanho M', sId);
      expect(r2.resposta).toContain('Vestido Fluido Midi Dorama');
      expect(r2.resposta).toContain('Tamanho: M');
      expect(r2.resposta).toContain('99,90');
    });
  });

  // BLOCO 4: Isolamento estrito de sessões (4 cenários)
  describe('Bloco 4: Isolamento estrito de sessões', () => {
    it('Cenário 17: Contexto do Cliente A não vaza para o Cliente B', () => {
      processarAtendimento('Quanto custa o vestido?', 'cli-a');
      processarAtendimento('Quanto custa a calça?', 'cli-b');

      const rA = processarAtendimento('E os tamanhos?', 'cli-a');
      expect(rA.resposta).toContain('P e M');

      const rB = processarAtendimento('E os tamanhos?', 'cli-b');
      expect(rB.resposta).toContain('36, 38, 40, 42 e 44');
    });

    it('Cenário 18: Limpar sessão A não afeta sessão B', () => {
      processarAtendimento('Quanto custa a camiseta?', 'cli-x');
      processarAtendimento('Quanto custa o vestido?', 'cli-y');

      limparSessao('cli-x');

      const rY = processarAtendimento('Quais os tamanhos dele?', 'cli-y');
      expect(rY.resposta).toContain('P e M');
    });

    it('Cenário 19: Sessão default anônima é isolada de sessões nomeadas', () => {
      processarAtendimento('Gostei da calça jeans', 'default');
      const rCustom = processarAtendimento('Quais os tamanhos?', 'sessao-nova-isolated');
      expect(rCustom.resposta).toContain('Camiseta (P, M e G)');
    });


    it('Cenário 20: Transição rápida de sessões sem contaminação cruzada', () => {
      processarAtendimento('Quero o vestido', 's-fast-1');
      processarAtendimento('Quero a camiseta', 's-fast-2');
      const r1 = processarAtendimento('G', 's-fast-1');
      expect(r1.intencao).toBe('TAMANHO_INVALIDO');
      const r2 = processarAtendimento('G', 's-fast-2');
      expect(r2.intencao).toBe('PRE_PEDIDO_GERADO');
    });
  });

  // BLOCO 5: Identificação de peças e validação de tamanhos (5 cenários)
  describe('Bloco 5: Identificação de peças e validação de tamanhos', () => {
    it('Cenário 21: Tamanho válido M para Camiseta é aceito', () => {
      const res = processarAtendimento('Quero comprar a camiseta tamanho M', 's-21');
      expect(res.intencao).toBe('PRE_PEDIDO_GERADO');
      expect(res.tamanho).toBe('M');
    });

    it('Cenário 22: Numeração 38 para Calça Jeans é aceita', () => {
      const res = processarAtendimento('Vou levar a calça jeans tamanho 38', 's-22');
      expect(res.intencao).toBe('PRE_PEDIDO_GERADO');
      expect(res.tamanho).toBe('38');
    });

    it('Cenário 23: Tamanho 42 para Camiseta é rejeitado com aviso da grade P/M/G', () => {
      const res = processarAtendimento('Quero comprar a camiseta tamanho 42', 's-23');
      expect(res.intencao).toBe('TAMANHO_INVALIDO');
      expect(res.resposta).toContain('P, M e G');
      expect(res.encaminhadoHumano).toBe(true);
    });

    it('Cenário 24: Calça tamanho G encaminha para humano', () => {
      const res = processarAtendimento('Tem calça tamanho G?', 's-24');
      expect(res.resposta).toBe(RESPOSTA_ENCAMINHAMENTO);
      expect(res.encaminhadoHumano).toBe(true);
      expect(res.linkWhatsapp).toContain('whatsapp.com');
    });

    it('Cenário 25: Vestido tamanho G é rejeitado com grade oficial', () => {
      const res = processarAtendimento('Quero comprar o vestido tamanho G', 's-25');
      expect(res.intencao).toBe('TAMANHO_INVALIDO');
      expect(res.resposta).toContain('P e M');
      expect(res.encaminhadoHumano).toBe(true);
    });
  });

});
