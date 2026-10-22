import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger/swaggerDoc.js';
import { authRouter } from './routes/authRoutes.js';
import { estoqueRouter } from './routes/estoqueRoutes.js';
import { vendasRouter } from './routes/vendasRoutes.js';
import { dashboardRouter } from './routes/dashboardRoutes.js';
import { lojaRouter } from './routes/lojaRoutes.js';
import { chatRouter } from './routes/chatRoutes.js';
import { atendimentosRouter } from './routes/atendimentosRoutes.js';
import { authMiddleware } from './middlewares/authMiddleware.js';

import { requireAdmin } from './middlewares/roleMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares essenciais
app.use(cors());
app.use(express.json());

// Rotas da API REST
app.use('/api/auth', authRouter);
app.use('/api/estoque', estoqueRouter);
app.use('/api/vendas', vendasRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/atendimentos', atendimentosRouter);
app.use('/api', lojaRouter);
app.use('/api/chat', chatRouter);


// ROTA DO SWAGGER PROTEGIDA POR ADMIN
// Regra de segurança estrita: apenas usuários autenticados com perfil ADMIN podem carregar e usar o Swagger UI
app.use(
  '/api-docs',
  (req, res, next) => {
    // Permite que o Swagger carregue seus assets internos (css/js estáticos) se o usuário já tiver autorização
    // ou valida token via header/query string
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token;
    }

    if (!token) {
      return res.status(401).send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Acesso Restrito — Swagger Boutique Layani</title>
          <style>
            body { font-family: -apple-system, sans-serif; background: #fff5f7; color: #2b0f1a; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 15px rgba(157,23,77,0.1); max-width: 500px; text-align: center; border: 1px solid #fad5df; }
            h2 { color: #9d174d; }
            code { background: #fdf2f8; padding: 4px 8px; border-radius: 4px; color: #9d174d; font-weight: bold; }
            p { line-height: 1.6; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>🔒 Documentação Swagger Protegida</h2>
            <p>O acesso à documentação interativa da API é <strong>exclusivo para Administradores</strong> da Boutique Layani.</p>
            <p>Para acessar via navegador, inclua o token de Administrador na URL:</p>
            <p><code>/api-docs?token=&lt;SEU_TOKEN_ADMIN&gt;</code></p>
            <p>Ou realize login como Admin no painel da loja.</p>
          </div>
        </body>
        </html>
      `);
    }

    // Se possui token, passa para a validação oficial de Admin
    return authMiddleware(req, res, () => {
      requireAdmin(req, res, next);
    });
  },
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Rota de Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    ambiente: process.env.NODE_ENV || 'development',
    dataHora: new Date().toISOString(),
  });
});

// Servir frontend compilado em produção (dist)
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback SPA para o frontend
app.use((req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/api-docs')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('API Boutique Layani Online.');
    }
  });
});


// Inicia servidor apenas se executado diretamente
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Boutique Layani API] Servidor rodando na porta ${PORT}`);
    console.log(`[Swagger Docs] Disponível para Admin em http://localhost:${PORT}/api-docs`);
  });
}

export default app;
