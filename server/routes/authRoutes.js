import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { USUARIOS, JWT_SECRET } from '../data/store.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req, res) => {
  const { email, senha } = req.body || {};

  if (!email || !senha) {
    return res.status(400).json({
      erro: 'Email e senha são obrigatórios para autenticação.',
    });
  }

  const usuario = USUARIOS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );

  if (!usuario) {
    return res.status(401).json({
      erro: 'Credenciais inválidas. Verifique o email e a senha.',
    });
  }

  const senhaValida = bcrypt.compareSync(senha, usuario.senhaHash);
  if (!senhaValida) {
    return res.status(401).json({
      erro: 'Credenciais inválidas. Verifique o email e a senha.',
    });
  }

  // Gera token seguro JWT com validade de 8 horas
  const payload = {
    id: usuario.id,
    nome: usuario.nome,
    email: usuario.email,
    role: usuario.role,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

  // NUNCA expor senhaHash
  return res.json({
    mensagem: `Bem-vindo(a), ${usuario.nome}!`,
    token,
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      role: usuario.role,
    },
  });
});

// POST /api/auth/register - Cadastro exclusivo de perfil CLIENTE (Segurança estrita: impede criação de admin)
authRouter.post('/register', (req, res) => {
  const { nome, email, senha } = req.body || {};

  if (!nome || !email || !senha) {
    return res.status(400).json({
      erro: 'Nome, email e senha são obrigatórios para cadastro.',
    });
  }

  const emailExiste = USUARIOS.some(
    (u) => u.email.toLowerCase() === email.toLowerCase().trim()
  );
  if (emailExiste) {
    return res.status(409).json({
      erro: 'Este email já está cadastrado no sistema.',
    });
  }

  // Regra de segurança: forçar SEMPRE o papel 'cliente'. Proibida criação de admin via rota pública.
  const novoUsuario = {
    id: `usr-cliente-${Date.now()}`,
    nome: nome.trim(),
    email: email.toLowerCase().trim(),
    senhaHash: bcrypt.hashSync(senha, 10),
    role: 'cliente',
    criadoEm: new Date().toISOString(),
  };

  USUARIOS.push(novoUsuario);

  const token = jwt.sign(
    {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      role: novoUsuario.role,
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );

  return res.status(201).json({
    mensagem: 'Cadastro realizado com sucesso!',
    token,
    usuario: {
      id: novoUsuario.id,
      nome: novoUsuario.nome,
      email: novoUsuario.email,
      role: novoUsuario.role,
    },
  });
});

// GET /api/auth/me - Retorna os dados do usuário autenticado
authRouter.get('/me', authMiddleware, (req, res) => {
  return res.json({
    usuario: req.user,
  });
});
