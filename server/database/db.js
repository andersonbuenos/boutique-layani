import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const configDB = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'layani_user',
  password: process.env.DB_PASSWORD || 'layani_pass_2026',
  database: process.env.DB_NAME || 'boutique_layani',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 2000,
};


let pool = null;
let mysqlConectado = false;

try {
  pool = mysql.createPool(configDB);
} catch (err) {
  console.warn('[MySQL] Pool não pôde ser instanciado:', err.message);
}

export async function testarConexaoMySQL() {
  if (!pool) return false;
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS teste');
    mysqlConectado = true;
    console.log(
      `[MySQL] Conectado com sucesso ao banco '${configDB.database}' em ${configDB.host}:${configDB.port}!`
    );
    return true;
  } catch (err) {
    mysqlConectado = false;
    console.warn(
      `[MySQL] Container ou banco local não detectado em ${configDB.host}:${configDB.port} (${err.code || err.message}). Operando em modo contingência.`
    );
    return false;
  }
}

export function isMySQLOnline() {
  return mysqlConectado;
}

export async function fecharPool() {
  if (pool) {
    try {
      await pool.end();
      mysqlConectado = false;
    } catch {}
  }
}

export async function executarQuery(sql, params = []) {
  if (!pool || !mysqlConectado) {
    throw new Error('MySQL offline. Utilizando repositório de contingência.');
  }
  const [resultados] = await pool.query(sql, params);
  return resultados;
}

export default pool;
