import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  SYSTEM_PROMPT_BOUTIQUE,
  sanitizarRespostaGroq,
  processarMensagemAssistente,
} from '../services/groqService.js';
import { LOJA_INFO } from '../services/knowledgeBase.js';

describe('Assistente Virtual com Groq AI — Guardrails & Governança', () => {
  const envOriginal = { ...process.env };

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    process.env = { ...envOriginal };
  });

  describe('Regra 1: Domínio Estrito sobre Moda e Boutique Layani', () => {
    it('o System Prompt deve orientar exclusivamente para moda, catálogo e figurinos de dorama', () => {
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('Boutique Layani');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('Camiseta Algodão Egípcio');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('Calça Jeans Skinny Flare');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('Vestido Fluido Midi Dorama');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('R$ 39,90');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('R$ 119,90');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('R$ 89,90');
    });

    it('em contingência/fallback sem API KEY, deve responder preços do catálogo com precisão', async () => {
      process.env.GROQ_API_KEY = '';
      const res = await processarMensagemAssistente({ mensagem: 'Quanto custa a camiseta?' });
      expect(res.texto).toContain('39,90');
      expect(res.provedor).toBe('motor-deterministico');
    });

    it('em contingência/fallback sem API KEY, deve responder horário e entrega da loja', async () => {
      process.env.GROQ_API_KEY = '';
      const resHorario = await processarMensagemAssistente({ mensagem: 'Qual o horário de funcionamento?' });
      expect(resHorario.texto).toContain('8h');
      expect(resHorario.texto).toContain('18h');

      const resEntrega = await processarMensagemAssistente({ mensagem: 'Qual o valor da entrega?' });
      expect(resEntrega.texto).toContain('10,00');
    });
  });

  describe('Regra 2: Bloqueio Categórico de Assuntos Externos (Política, Guerra, Geopolítica)', () => {
    it('o System Prompt deve proibir explicitamente política, guerras, geopolítica e notícias', () => {
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('BLOQUEIO DE ASSUNTOS EXTERNOS');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('política');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('guerras');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('geopolítica');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('notícias');
    });

    it('no fallback, perguntas fora de escopo (política/código) devem ser recusadas educadamente', async () => {
      process.env.GROQ_API_KEY = '';
      const res = await processarMensagemAssistente({ mensagem: 'O que você acha da guerra ou das eleições?' });
      expect(res.texto).toContain('Boutique Layani');
    });
  });

  describe('Regra 3: Proteção Estrita contra Vazamento de Usuários, Senhas e Tokens', () => {
    it('o System Prompt deve proibir expressamente falar sobre admin, atendente e tokens', () => {
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('PROTEÇÃO DE DADOS SENSÍVEIS');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('admin');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('atendente');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('GROQ_API_KEY');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('JWT');
    });

    it('o sanitizador de camada dupla deve bloquear vazamento acidental de token JWT', () => {
      const respostaComJWT = 'Aqui está a informação solicitada: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHjvsnw';
      const limpo = sanitizarRespostaGroq(respostaComJWT);
      expect(limpo).not.toContain('eyJhbGci');
      expect(limpo).toContain('Assistente Virtual da Boutique Layani');
    });

    it('o sanitizador de camada dupla deve bloquear vazamento de chaves de API da Groq', () => {
      const respostaComKey = 'Sua chave de acesso é gsk_1234567890abcdefghijklmnopqrstuvwxyz123456';
      const limpo = sanitizarRespostaGroq(respostaComKey);
      expect(limpo).not.toContain('gsk_123456');
      expect(limpo).toContain('Assistente Virtual da Boutique Layani');
    });

    it('o sanitizador de camada dupla deve bloquear nomes de usuários internos ou senhas', () => {
      const respostaSensivel = 'O usuário admin_layani tem a senha admin123 no banco';
      const limpo = sanitizarRespostaGroq(respostaSensivel);
      expect(limpo).not.toContain('admin_layani');
      expect(limpo).not.toContain('admin123');
      expect(limpo).toContain('Assistente Virtual da Boutique Layani');
    });

    it('o sanitizador deve limpar asteriscos indesejados de markdown', () => {
      const respostaComAsteriscos = 'Excelente escolha! O **Vestido Fluido** custa R$ 89,90.\n* **Preço:** R$ 89,90';
      const limpo = sanitizarRespostaGroq(respostaComAsteriscos);
      expect(limpo).not.toContain('**');
      expect(limpo).toContain('Vestido Fluido');
    });
  });

  describe('Regra 4: Cortesia, Carisma e Redirecionamento Acolhedor', () => {
    it('o System Prompt deve exigir tom cortês, carismático e acolhedor', () => {
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('cortês');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('carismática');
      expect(SYSTEM_PROMPT_BOUTIQUE).toContain('sofisticação');
    });

    it('ao solicitar expressamente atendente humano, deve fornecer link de WhatsApp', async () => {
      process.env.GROQ_API_KEY = '';
      const res = await processarMensagemAssistente({ mensagem: 'Quero falar com um atendente humano por favor' });
      expect(res.encaminhadoHumano).toBe(true);
      expect(res.linkWhatsapp).toBe(LOJA_INFO.linkWhatsapp);
    });
  });
});
