import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Modelagem do Banco de Dados Relacional MySQL e Docker - Prisma & Cipher', () => {
  const schemaPath = path.resolve(__dirname, '../database/schema.sql');
  const seedPath = path.resolve(__dirname, '../database/seed.sql');
  const initPath = path.resolve(__dirname, '../database/init.sql');
  const dockerComposePath = path.resolve(__dirname, '../../docker-compose.yml');
  const envExamplePath = path.resolve(__dirname, '../../.env.example');

  it('o arquivo schema.sql deve existir e conter as 11 tabelas relacionais fundamentais', () => {
    expect(fs.existsSync(schemaPath)).toBe(true);
    const sql = fs.readFileSync(schemaPath, 'utf-8');

    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `usuarios`');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `categorias`');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `produtos`');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `estoque`');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `vendedores`');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `pedidos`');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `pedido_itens`');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `atendimentos`');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `atendimento_mensagens`');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `fato_vendas_mensal`');
    expect(sql).toContain('CREATE TABLE IF NOT EXISTS `fato_motivos_cancelamento`');
  });

  it('o arquivo seed.sql deve conter os dados dos usuários admin e atendente, 3 produtos e métricas do amCharts', () => {
    expect(fs.existsSync(seedPath)).toBe(true);
    const sql = fs.readFileSync(seedPath, 'utf-8');

    expect(sql).toContain('admin@boutiquelayani.com.br');
    expect(sql).toContain('atendente@boutiquelayani.com.br');
    expect(sql).toContain('LAY-CAM-001');
    expect(sql).toContain('LAY-CAL-002');
    expect(sql).toContain('LAY-VES-003');
    expect(sql).toContain('Mai/26');
    expect(sql).toContain('Out/26');
  });


  it('o docker-compose.yml deve conter o serviço mysql 8.0 com volume persistente e init.sql', () => {
    expect(fs.existsSync(dockerComposePath)).toBe(true);
    const compose = fs.readFileSync(dockerComposePath, 'utf-8');

    expect(compose).toContain('image: mysql:8.0');
    expect(compose).toContain('boutique_layani_mysql');
    expect(compose).toContain('3306:3306');
    expect(compose).toContain('mysql_data:/var/lib/mysql');
    expect(compose).toContain('init.sql');
  });

  it('o arquivo .env.example deve documentar todas as credenciais do banco MySQL', () => {
    expect(fs.existsSync(envExamplePath)).toBe(true);
    const env = fs.readFileSync(envExamplePath, 'utf-8');

    expect(env).toContain('DB_HOST=');
    expect(env).toContain('DB_PORT=3306');
    expect(env).toContain('DB_USER=layani_user');
    expect(env).toContain('DB_NAME=boutique_layani');
  });
});
