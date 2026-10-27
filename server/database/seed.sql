-- ============================================================
-- BOUTIQUE LAYANI — CARGA INICIAL DE DADOS (SEED SQL)
-- Modelagem: Prisma Analytics (Data & BI Specialist)
-- ============================================================

USE `boutique_layani`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. SEED DE USUÁRIOS (Hashes bcrypt idênticos aos do store.js)
INSERT INTO `usuarios` (`id`, `uuid`, `nome`, `email`, `senha_hash`, `role`) VALUES
(1, 'usr-admin-1', 'Administrador Layani', 'admin@boutiquelayani.com.br', '$2a$10$7Zrqc1kHQyW8P4ZqB5QZ3eC3Z3Y.9Kx1l0kXzY2.kP1ZqB5QZ3eC3', 'admin'),
(2, 'usr-atendente-1', 'Camila Atendente', 'atendente@boutiquelayani.com.br', '$2a$10$7Zrqc1kHQyW8P4ZqB5QZ3eC3Z3Y.9Kx1l0kXzY2.kP1ZqB5QZ3eC3', 'atendente')
ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`);


-- 2. SEED DE CATEGORIAS
INSERT INTO `categorias` (`id`, `nome`, `descricao`) VALUES
(1, 'Vestuário Feminino', 'Moda feminina refinada com inspiração clássica e figurinos de K-Dramas')
ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`);

-- 3. SEED DE PRODUTOS OFICIAIS
INSERT INTO `produtos` (`id`, `sku`, `nome`, `categoria_id`, `preco_venda`, `custo_unitario`, `tamanho_padrao`, `vibe_dorama`, `descricao_dorama`) VALUES
(1, 'LAY-CAM-001', 'Camiseta Algodão Egípcio', 1, 39.90, 18.00, 'Grade P / M / G', 'Protagonista de Comédia Romântica', 'Inspirada no estilo casual e irresistível das protagonistas de k-dramas em Seul. O visual perfeito para aquele encontro despretensioso em uma cafeteria fofa com o herdeiro chaebol disfarçado. Confortável, versátil e cheia de charme natural!'),
(2, 'LAY-CAL-002', 'Calça Jeans Skinny Flare', 1, 119.90, 55.00, 'Grade 36 a 44', 'Estilo Urbano de Gangnam', 'A clássica calça jeans com caimento impecável, digna das cenas de correria romântica sob o guarda-chuva amarelo ou do dia a dia da mocinha batalhadora que conquista todos pela sua determinação. Uma peça coringa que rouba a cena em qualquer episódio!'),
(3, 'LAY-VES-003', 'Vestido Fluido Midi Dorama', 1, 89.90, 38.00, 'Grade P / M', 'Cena em Câmera Lenta com Trilha Sonora', 'Aquele look marcante do momento em que o vento sopra suavemente e a trilha sonora romântica toca ao fundo. Fluido, delicado e encantador, é perfeito para o grande baile de gala ou para aquele reencontro inesperado sob as cerejeiras em flor!'),
(4, 'LAY-BLA-004', 'Blazer Alfaiataria Seul', 1, 189.90, 85.00, 'Grade P / M / G', 'Herdeira Chaebol & CEO Empoderada', 'Corte de alfaiataria impecável estruturado com linho misto nobre ideal para o clima brasileiro. Ombreiras discretas e botões perolados que transmitem elegância e poder refinado.'),
(5, 'LAY-SED-005', 'Blusa de Seda Gola Laço Gangnam', 1, 98.90, 42.00, 'Grade P / M / G', 'Romance Delicado no Escritório', 'Seda acetinada com toque suave na pele e gola com laço clássico removível. O equilíbrio perfeito entre a delicadeza romântica coreana e o caimento sensual elegante brasileiro.'),
(6, 'LAY-SAI-006', 'Saia Midi Plissada Hanbok Chic', 1, 109.90, 48.00, 'Grade P / M / G', 'Passeio Romântico ao Entardecer', 'Inspirada na silhueta do Hanbok combinada à alfaiataria contemporânea. O plissado perfeito confere movimento hipnotizante ao caminhar com cintura alta modeladora.'),
(7, 'LAY-TWE-007', 'Conjunto Tweed Chaebol Elegance', 1, 229.90, 105.00, 'Grade P / M', 'Jantar de Gala e Família Tradicional', 'Tweed clássico texturizado com fios dourados sutis e forro acetinado. Casaqueto refinado e saia estruturada, exalando a sofisticação da alta sociedade de Seul.'),
(8, 'LAY-MAC-008', 'Macacão Pantalona Seda Hongdae', 1, 169.90, 75.00, 'Grade P / M / G', 'Estreia de Tapete Vermelho', 'Linhas alongadoras em crepe de seda fluido com decote suave em V e faixa acinturada. União do estilo vanguardista de Hongdae com a exuberância feminina brasileira.')
ON DUPLICATE KEY UPDATE `preco_venda` = VALUES(`preco_venda`);

-- 4. SEED DE ESTOQUE
INSERT INTO `estoque` (`id`, `produto_id`, `quantidade`, `estoque_minimo`, `status`, `ultima_entrada`) VALUES
(1, 1, 45, 15, 'Em estoque', '2026-10-15'),
(2, 2, 28, 10, 'Em estoque', '2026-10-12'),
(3, 3, 8, 12, 'Estoque baixo', '2026-10-05'),
(4, 4, 16, 8, 'Em estoque', '2026-10-20'),
(5, 5, 22, 10, 'Em estoque', '2026-10-18'),
(6, 6, 19, 8, 'Em estoque', '2026-10-19'),
(7, 7, 12, 6, 'Em estoque', '2026-10-21'),
(8, 8, 14, 6, 'Em estoque', '2026-10-22')
ON DUPLICATE KEY UPDATE `quantidade` = VALUES(`quantidade`);

-- 5. SEED DE VENDEDORES
INSERT INTO `vendedores` (`id`, `usuario_id`, `nome`, `canal_principal`, `meta_mensal`, `vendas_realizadas`, `pedidos_fechados`, `pedidos_cancelados`, `taxa_conversao`, `avaliacao_media`) VALUES
(1, 2, 'Camila Atendente', 'WhatsApp & Chat', 3500.00, 3120.00, 24, 3, 68.50, 4.90),
(2, NULL, 'Mariana Consultora', 'Loja Física & WhatsApp', 4000.00, 4280.00, 31, 1, 74.20, 5.00),
(3, NULL, 'Beatriz Especialista', 'Chat Virtual', 3000.00, 1950.00, 15, 6, 48.00, 4.50)
ON DUPLICATE KEY UPDATE `vendas_realizadas` = VALUES(`vendas_realizadas`);

-- 6. SEED DA TABELA FATO MENSAL (amCharts 5)
INSERT INTO `fato_vendas_mensal` (`id`, `ano_mes`, `rotulo_mes`, `faturamento_bruto`, `pecas_vendidas`, `pedidos_concluidos`, `pedidos_cancelados`) VALUES
(1, '2026-05', 'Mai/26', 6420.00, 76, 52, 4),
(2, '2026-06', 'Jun/26', 7150.00, 84, 59, 3),
(3, '2026-07', 'Jul/26', 8200.00, 98, 68, 5),
(4, '2026-08', 'Ago/26', 7890.00, 91, 64, 6),
(5, '2026-09', 'Set/26', 8940.00, 108, 73, 4),
(6, '2026-10', 'Out/26', 9350.00, 114, 81, 8)
ON DUPLICATE KEY UPDATE `faturamento_bruto` = VALUES(`faturamento_bruto`);

-- 7. SEED DE CANCELAMENTOS
INSERT INTO `fato_motivos_cancelamento` (`id`, `motivo`, `percentual`, `quantidade`, `valor_perdido`) VALUES
(1, 'Dúvida de tamanho/grade não informada', 42, 8, 890.00),
(2, 'Desistência de frete ou área não atendida', 26, 5, 480.00),
(3, 'Forma de pagamento (procurou parcelamento)', 18, 3, 340.00),
(4, 'Demora no retorno humano do WhatsApp', 14, 2, 190.00)
ON DUPLICATE KEY UPDATE `percentual` = VALUES(`percentual`);

SET FOREIGN_KEY_CHECKS = 1;
