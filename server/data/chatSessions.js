// Repositório compartilhado de sessões de chat em tempo real
export const SESSOES_CHAT = [
  {
    id: 'chat-sessao-1',
    clienteNome: 'Juliana Silva',
    clienteEmail: 'cliente@gmail.com',
    canal: 'Chat Virtual da Loja',
    status: 'on', // 'on' (com alert dot) ou 'off'
    atendimentoStatus: 'bot', // 'bot', 'direcionando', 'humano', 'encerrado'
    atendenteNome: null,
    ultimaMensagemEm: new Date(Date.now() - 1000 * 60 * 2).toISOString(), // há 2 minutos
    mensagens: [
      {
        id: 'msg-1-1',
        autor: 'assistente',
        autorNome: 'Assistente Virtual',
        texto: 'Olá! Seja bem-vinda à Boutique Layani. Como posso ajudar você hoje?',
        dataHora: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      },
      {
        id: 'msg-1-2',
        autor: 'cliente',
        autorNome: 'Juliana Silva',
        texto: 'Olá! Vocês têm a calça jeans tamanho 38 disponível? Gostaria de saber também sobre o frete.',
        dataHora: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
      },
    ],
  },
  {
    id: 'chat-sessao-2',
    clienteNome: 'Fernanda Rocha',
    clienteEmail: 'fernanda.rocha@hotmail.com',
    canal: 'Chat Virtual da Loja',
    status: 'off',
    atendimentoStatus: 'encerrado',
    atendenteNome: 'Camila Atendente',
    ultimaMensagemEm: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    mensagens: [
      {
        id: 'msg-2-1',
        autor: 'cliente',
        autorNome: 'Fernanda Rocha',
        texto: 'Obrigada pelo atendimento! Comprei o vestido.',
        dataHora: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
      },
      {
        id: 'msg-2-2',
        autor: 'assistente',
        autorNome: 'Assistente Virtual',
        texto: 'Atendimento finalizado com sucesso! A Boutique Layani agradece. Tenha um ótimo dia!',
        dataHora: new Date(Date.now() - 1000 * 60 * 24).toISOString(),
      },
    ],
  },
  {
    id: 'chat-sessao-3',
    clienteNome: 'Beatriz Lima',
    clienteEmail: 'beatriz.lima@yahoo.com',
    canal: 'Chat Virtual da Loja',
    status: 'on',
    atendimentoStatus: 'bot',
    atendenteNome: null,
    ultimaMensagemEm: new Date(Date.now() - 1000 * 30).toISOString(), // há 30 segundos
    mensagens: [
      {
        id: 'msg-3-1',
        autor: 'cliente',
        autorNome: 'Beatriz Lima',
        texto: 'Quero fechar a compra do vestido tamanho M, vocês entregam hoje?',
        dataHora: new Date(Date.now() - 1000 * 30).toISOString(),
      },
    ],
  },
  {
    id: 'chat-sessao-4',
    clienteNome: 'Mariana Duarte',
    clienteEmail: 'mariana.duarte@outlook.com',
    canal: 'Chat Virtual da Loja',
    status: 'off',
    atendimentoStatus: 'bot',
    atendenteNome: null,
    ultimaMensagemEm: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    mensagens: [
      {
        id: 'msg-4-1',
        autor: 'cliente',
        autorNome: 'Mariana Duarte',
        texto: 'Qual é o horário de atendimento no sábado?',
        dataHora: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      },
    ],
  },
];
