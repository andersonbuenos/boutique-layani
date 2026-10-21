import { describe, it, expect } from 'vitest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { USUARIOS, JWT_SECRET } from '../data/store.js';
import { processarAtendimento } from '../services/chatEngine.js';

describe('Segurança e Regras de Negócio do Backend - Boutique Layani', () => {
  describe('Armazenamento seguro de senhas e JWT', () => {
    it('todas as senhas dos usuários devem estar hasheadas com bcrypt', () => {
      USUARIOS.forEach((usuario) => {
        expect(usuario.senhaHash).toBeDefined();
        expect(usuario.senhaHash.startsWith('$2a$') || usuario.senhaHash.startsWith('$2b$')).toBe(true);
        expect(usuario.senha).toBeUndefined(); // Garante que a senha pura não existe no objeto
      });
    });

    it('deve autenticar o admin com a senha correta e gerar token JWT', () => {
      const admin = USUARIOS.find((u) => u.email === 'admin@boutiquelayani.com.br');
      const senhaCorreta = bcrypt.compareSync('Admin@Layani2026', admin.senhaHash);
      expect(senhaCorreta).toBe(true);

      const token = jwt.sign(
        { id: admin.id, nome: admin.nome, email: admin.email, role: admin.role },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      const decodificado = jwt.verify(token, JWT_SECRET);
      expect(decodificado.role).toBe('admin');
      expect(decodificado.email).toBe('admin@boutiquelayani.com.br');
    });

    it('deve rejeitar senha incorreta para o admin', () => {
      const admin = USUARIOS.find((u) => u.email === 'admin@boutiquelayani.com.br');
      const senhaIncorreta = bcrypt.compareSync('SenhaErrada123', admin.senhaHash);
      expect(senhaIncorreta).toBe(false);
    });
  });

  describe('Autonomia do Assistente Virtual no Backend (SEM IA)', () => {
    it('deve responder preço da camiseta com precisão', () => {
      const res = processarAtendimento('quanto custa a camiseta?');
      expect(res.resposta).toContain('R$ 39,90');
      expect(res.encaminhadoHumano).toBe(false);
    });

    it('deve responder horário da loja', () => {
      const res = processarAtendimento('qual o horário de funcionamento?');
      expect(res.resposta).toContain('segunda a sábado');
      expect(res.resposta).toContain('8h');
      expect(res.resposta).toContain('18h');
    });

    it('deve responder taxa de entrega fixa', () => {
      const res = processarAtendimento('qual o valor da entrega?');
      expect(res.resposta).toContain('R$ 10,00');
    });

    it('deve encaminhar dúvidas de tamanho/estoque para o WhatsApp com botão', () => {
      const res = processarAtendimento('Tem calça tamanho G?');
      expect(res.resposta).toBe(
        'Não tenho essa informação no momento. Por favor, continue o atendimento neste botão.'
      );
      expect(res.encaminhadoHumano).toBe(true);
      expect(res.linkWhatsapp).toContain('whatsapp.com');
    });
  });
});
