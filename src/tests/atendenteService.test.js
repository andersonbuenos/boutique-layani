import { describe, it, expect } from 'vitest';
import {
  responderPergunta,
  normalizarTexto,
  RESPOSTA_ENCAMINHAMENTO,
} from '../services/atendenteService';

describe('Serviço de Atendimento - Boutique Layani', () => {
  describe('Normalização de texto', () => {
    it('deve remover acentos e converter para minúsculas', () => {
      expect(normalizarTexto('Calça Jeans')).toBe('calca jeans');
      expect(normalizarTexto('HORÁRIO de FUNCIONAMENTO?!')).toBe(
        'horario de funcionamento'
      );
    });
  });

  describe('Testes obrigatórios do SPECS.md (Seção 7)', () => {
    it('Pergunta: "Quanto custa a camiseta?" -> deve responder R$ 39,90', () => {
      const resposta = responderPergunta('Quanto custa a camiseta?');
      expect(resposta).toContain('39,90');
    });

    it('Pergunta: "Qual o horário?" -> deve responder segunda a sábado, das 8h às 18h', () => {
      const resposta = responderPergunta('Qual o horário?');
      expect(resposta).toContain('segunda a sábado');
      expect(resposta).toContain('8h');
      expect(resposta).toContain('18h');
    });

    it('Pergunta: "Qual o valor da entrega?" -> deve responder R$ 10,00', () => {
      const resposta = responderPergunta('Qual o valor da entrega?');
      expect(resposta).toContain('10,00');
    });

    it('Pergunta: "Tem calça tamanho G?" -> deve encaminhar para atendente humano', () => {
      const resposta = responderPergunta('Tem calça tamanho G?');
      expect(resposta).toBe(RESPOSTA_ENCAMINHAMENTO);
    });

    it('Pergunta: "Vocês vendem sapatos?" -> deve encaminhar para atendente humano', () => {
      const resposta = responderPergunta('Vocês vendem sapatos?');
      expect(resposta).toBe(RESPOSTA_ENCAMINHAMENTO);
    });
  });

  describe('Skill 1 - Consultar preços', () => {
    it('deve responder o preço da calça jeans', () => {
      const resposta = responderPergunta('Quanto custa a calça?');
      expect(resposta).toContain('119,90');
    });

    it('deve responder o preço do vestido', () => {
      const resposta = responderPergunta('Qual o valor do vestido?');
      expect(resposta).toContain('89,90');
    });
  });


  describe('Skill 4 - Encaminhar ao humano', () => {
    it('não deve informar estoque ou disponibilidade', () => {
      expect(responderPergunta('Tem vestido no estoque?')).toBe(
        RESPOSTA_ENCAMINHAMENTO
      );
      expect(responderPergunta('Tem camiseta disponível?')).toBe(
        RESPOSTA_ENCAMINHAMENTO
      );
    });

    it('não deve informar prazos de entrega ou trocas', () => {
      expect(responderPergunta('Qual o prazo de entrega?')).toBe(
        RESPOSTA_ENCAMINHAMENTO
      );
      expect(responderPergunta('Como funciona a troca?')).toBe(
        RESPOSTA_ENCAMINHAMENTO
      );
    });

    it('não deve aceitar ou simular pagamentos', () => {
      expect(responderPergunta('Aceita cartão de crédito?')).toBe(
        RESPOSTA_ENCAMINHAMENTO
      );
      expect(responderPergunta('Posso pagar no pix?')).toBe(
        RESPOSTA_ENCAMINHAMENTO
      );
    });
  });
});
