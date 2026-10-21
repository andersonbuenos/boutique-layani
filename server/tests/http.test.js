import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import jwt from 'jsonwebtoken';
import http from 'http';
import app from '../index.js';
import { USUARIOS, JWT_SECRET } from '../data/store.js';

describe('Endpoints REST e Proteção RBAC (Somente GET) - Boutique Layani', () => {
  let server;
  let baseUrl;
  let tokenAdmin;
  let tokenAtendente;
  let tokenCliente;

  beforeAll(async () => {
    server = http.createServer(app);
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    baseUrl = `http://127.0.0.1:${port}`;

    const admin = USUARIOS.find((u) => u.role === 'admin');
    const atendente = USUARIOS.find((u) => u.role === 'atendente');
    const cliente = USUARIOS.find((u) => u.role === 'cliente');

    tokenAdmin = jwt.sign(
      { id: admin.id, nome: admin.nome, email: admin.email, role: 'admin' },
      JWT_SECRET
    );
    tokenAtendente = jwt.sign(
      { id: atendente.id, nome: atendente.nome, email: atendente.email, role: 'atendente' },
      JWT_SECRET
    );
    tokenCliente = jwt.sign(
      { id: cliente.id, nome: cliente.nome, email: cliente.email, role: 'cliente' },
      JWT_SECRET
    );
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it('GET /api/estoque sem token deve retornar 401', async () => {
    const res = await fetch(`${baseUrl}/api/estoque`);
    expect(res.status).toBe(401);
  });

  it('GET /api/estoque com perfil cliente deve retornar 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/estoque`, {
      headers: { Authorization: `Bearer ${tokenCliente}` },
    });
    expect(res.status).toBe(403);
  });

  it('GET /api/estoque com perfil atendente deve retornar 200', async () => {
    const res = await fetch(`${baseUrl}/api/estoque`, {
      headers: { Authorization: `Bearer ${tokenAtendente}` },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.itens.length).toBeGreaterThan(0);
  });

  it('GET /api/vendas com perfil atendente deve retornar 403 Forbidden', async () => {
    const res = await fetch(`${baseUrl}/api/vendas`, {
      headers: { Authorization: `Bearer ${tokenAtendente}` },
    });
    expect(res.status).toBe(403);
  });

  it('GET /api/vendas com perfil admin deve retornar 200', async () => {
    const res = await fetch(`${baseUrl}/api/vendas`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.pedidos.length).toBeGreaterThan(0);
    expect(data.resumo.faturamentoTotal).toBeGreaterThan(0);
  });

  it('GET /api/dashboard com perfil admin deve retornar 200 e KPIs', async () => {
    const res = await fetch(`${baseUrl}/api/dashboard`, {
      headers: { Authorization: `Bearer ${tokenAdmin}` },
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.kpis.faturamentoBruto).toBeGreaterThan(0);
  });

  it('GET /api-docs sem token deve retornar 401 e bloquear Swagger para não-admin', async () => {
    const res = await fetch(`${baseUrl}/api-docs`);
    expect(res.status).toBe(401);
    const text = await res.text();
    expect(text).toContain('exclusivo para Administradores');
  });

  it('POST /api/auth/register deve forçar perfil cliente mesmo se tentarem enviar admin', async () => {
    const novoEmail = `hacker-${Date.now()}@teste.com`;
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome: 'Tentativa Invasão',
        email: novoEmail,
        senha: '123',
        role: 'admin',
      }),
    });
    expect(res.status).toBe(201);
    const data = await res.json();
    expect(data.usuario.role).toBe('cliente');
  });
});
