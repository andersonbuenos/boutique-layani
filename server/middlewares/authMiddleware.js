import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../data/store.js';

export function authMiddleware(req, res, next) {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query && req.query.token) {
    // Permite passagem de token via query string para facilitar acesso autenticado ao Swagger UI
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({
      erro: 'Acesso não autorizado. Token JWT ausente.',
      dica: 'Envie o cabeçalho Authorization: Bearer <seu_token> ou parâmetro ?token=<token>',
    });
  }

  try {
    const decodificado = jwt.verify(token, JWT_SECRET);
    req.user = decodificado;
    next();
  } catch (err) {
    return res.status(401).json({
      erro: 'Token inválido ou expirado. Realize login novamente.',
    });
  }
}
