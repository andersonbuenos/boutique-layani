export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Boutique Layani API — Gestão & Atendimento',
    version: '2.0.0',
    description:
      'API REST da Boutique Layani com controle de acesso baseado em papéis (RBAC), segurança com JWT e endpoints exclusivos GET para controle de estoque, vendas e dashboard administrativo.',
    contact: {
      name: 'Coordenação Técnica - Boutique Layani',
    },
  },
  servers: [
    {
      url: '/api',
      description: 'Servidor da Aplicação',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'Insira seu token JWT gerado no endpoint /auth/login com perfil ADMIN.',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
  paths: {
    '/auth/login': {
      post: {
        tags: ['Autenticação'],
        summary: 'Autentica usuário e retorna token JWT (Sem expor hash/senhas)',
        security: [],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'senha'],
                properties: {
                  email: {
                    type: 'string',
                    example: 'admin@boutiquelayani.com.br',
                  },
                  senha: {
                    type: 'string',
                    example: 'Admin@Layani2026',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login efetuado com sucesso',
          },
          401: {
            description: 'Credenciais inválidas',
          },
        },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Autenticação'],
        summary: 'Retorna perfil do usuário logado',
        responses: {
          200: {
            description: 'Perfil autenticado',
          },
          401: {
            description: 'Token inválido ou ausente',
          },
        },
      },
    },
    '/estoque': {
      get: {
        tags: ['Controle de Estoque (Somente GET)'],
        summary: 'Consulta o inventário de estoque com status e custos',
        description: 'Permitido exclusivamente para Admin e Atendente.',
        responses: {
          200: {
            description: 'Lista de estoque obtida com sucesso',
          },
          401: {
            description: 'Não autorizado',
          },
          403: {
            description: 'Acesso negado para perfis sem permissão',
          },
        },
      },
    },
    '/vendas': {
      get: {
        tags: ['Controle de Vendas (Somente GET)'],
        summary: 'Consulta o histórico completo de pedidos e faturamento',
        description: 'Exclusivo para perfil Admin.',
        responses: {
          200: {
            description: 'Histórico de vendas obtido com sucesso',
          },
          401: {
            description: 'Não autorizado',
          },
          403: {
            description: 'Acesso restrito ao perfil Admin',
          },
        },
      },
    },
    '/dashboard': {
      get: {
        tags: ['Dashboard Analítico (Somente GET)'],
        summary: 'Consulta os principais indicadores de desempenho (KPIs) da boutique',
        description: 'Exclusivo para perfil Admin.',
        responses: {
          200: {
            description: 'Métricas do painel executivo obtidas com sucesso',
          },
          401: {
            description: 'Não autorizado',
          },
          403: {
            description: 'Acesso restrito ao perfil Admin',
          },
        },
      },
    },
    '/produtos': {
      get: {
        tags: ['Catálogo Público (Somente GET)'],
        summary: 'Consulta pública dos produtos oficiais',
        security: [],
        responses: {
          200: {
            description: 'Lista pública de produtos',
          },
        },
      },
    },
    '/loja': {
      get: {
        tags: ['Informações da Loja (Somente GET)'],
        summary: 'Consulta horários e taxa fixa de entrega',
        security: [],
        responses: {
          200: {
            description: 'Informações da loja',
          },
        },
      },
    },
  },
};
