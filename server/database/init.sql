-- ============================================================
-- BOUTIQUE LAYANI — SCHEMA RELACIONAL ROBUSTO (MySQL 8.0+)
-- Modelagem: Prisma Analytics (Data & BI Specialist)
-- ============================================================

CREATE DATABASE IF NOT EXISTS `boutique_layani`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `boutique_layani`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. TABELA DE USUÁRIOS & RBAC
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `uuid` VARCHAR(64) NOT NULL UNIQUE,
  `nome` VARCHAR(150) NOT NULL,
  `email` VARCHAR(191) NOT NULL UNIQUE,
  `senha_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'atendente', 'cliente') NOT NULL DEFAULT 'cliente',
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_usuarios_email` (`email`),
  INDEX `idx_usuarios_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. TABELA DE CATEGORIAS
CREATE TABLE IF NOT EXISTS `categorias` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL UNIQUE,
  `descricao` VARCHAR(255) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. TABELA DE PRODUTOS
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sku` VARCHAR(50) NOT NULL UNIQUE,
  `nome` VARCHAR(150) NOT NULL,
  `categoria_id` INT NOT NULL,
  `preco_venda` DECIMAL(10,2) NOT NULL,
  `custo_unitario` DECIMAL(10,2) NOT NULL,
  `tamanho_padrao` VARCHAR(100) NOT NULL,
  `vibe_dorama` VARCHAR(255) NULL,
  `descricao_dorama` TEXT NULL,
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_produtos_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON UPDATE CASCADE,
  INDEX `idx_produtos_sku` (`sku`),
  INDEX `idx_produtos_nome` (`nome`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TABELA DE CONTROLE DE ESTOQUE
CREATE TABLE IF NOT EXISTS `estoque` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `produto_id` INT NOT NULL UNIQUE,
  `quantidade` INT NOT NULL DEFAULT 0,
  `estoque_minimo` INT NOT NULL DEFAULT 10,
  `status` ENUM('Em estoque', 'Estoque baixo', 'Esgotado') NOT NULL DEFAULT 'Em estoque',
  `ultima_entrada` DATE NULL,
  `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_estoque_produto` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. TABELA DE VENDEDORES & METAS
CREATE TABLE IF NOT EXISTS `vendedores` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NULL UNIQUE,
  `nome` VARCHAR(150) NOT NULL,
  `canal_principal` VARCHAR(100) NOT NULL,
  `meta_mensal` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `vendas_realizadas` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `pedidos_fechados` INT NOT NULL DEFAULT 0,
  `pedidos_cancelados` INT NOT NULL DEFAULT 0,
  `taxa_conversao` DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  `avaliacao_media` DECIMAL(3,2) NOT NULL DEFAULT 5.00,
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_vendedores_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 6. TABELA DE PEDIDOS / VENDAS
CREATE TABLE IF NOT EXISTS `pedidos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `codigo_pedido` VARCHAR(50) NOT NULL UNIQUE,
  `cliente_id` INT NULL,
  `cliente_nome` VARCHAR(150) NOT NULL,
  `cliente_email` VARCHAR(191) NULL,
  `vendedor_id` INT NULL,
  `canal` ENUM('WhatsApp', 'Chat Virtual', 'Loja Física') NOT NULL DEFAULT 'Chat Virtual',
  `taxa_entrega` DECIMAL(10,2) NOT NULL DEFAULT 10.00,
  `valor_total` DECIMAL(10,2) NOT NULL,
  `status` ENUM('Pendente', 'Concluído', 'Cancelado') NOT NULL DEFAULT 'Concluído',
  `motivo_cancelamento` VARCHAR(255) NULL,
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_pedidos_cliente` FOREIGN KEY (`cliente_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pedidos_vendedor` FOREIGN KEY (`vendedor_id`) REFERENCES `vendedores` (`id`) ON DELETE SET NULL,
  INDEX `idx_pedidos_status` (`status`),
  INDEX `idx_pedidos_canal` (`canal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. ITENS DO PEDIDO
CREATE TABLE IF NOT EXISTS `pedido_itens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `pedido_id` INT NOT NULL,
  `produto_id` INT NOT NULL,
  `tamanho` VARCHAR(20) NOT NULL,
  `quantidade` INT NOT NULL DEFAULT 1,
  `preco_unitario` DECIMAL(10,2) NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  CONSTRAINT `fk_itens_pedido` FOREIGN KEY (`pedido_id`) REFERENCES `pedidos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_itens_produto` FOREIGN KEY (`produto_id`) REFERENCES `produtos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. SESSÕES DE ATENDIMENTO (LIVE CHAT)
CREATE TABLE IF NOT EXISTS `atendimentos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `session_id` VARCHAR(100) NOT NULL UNIQUE,
  `cliente_nome` VARCHAR(150) NOT NULL,
  `cliente_email` VARCHAR(191) NULL,
  `canal` VARCHAR(100) NOT NULL DEFAULT 'Chat Virtual da Loja',
  `status` ENUM('on', 'off') NOT NULL DEFAULT 'off',
  `atendimento_status` ENUM('bot', 'direcionando', 'humano', 'encerrado') NOT NULL DEFAULT 'bot',
  `atendente_nome` VARCHAR(150) NULL,
  `ultima_mensagem` TEXT NULL,
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_atendimentos_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. MENSAGENS DOS ATENDIMENTOS
CREATE TABLE IF NOT EXISTS `atendimento_mensagens` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `atendimento_id` INT NOT NULL,
  `autor` ENUM('cliente', 'assistente', 'atendente', 'sistema') NOT NULL,
  `autor_nome` VARCHAR(150) NOT NULL,
  `texto` TEXT NOT NULL,
  `criado_em` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_mensagens_atendimento` FOREIGN KEY (`atendimento_id`) REFERENCES `atendimentos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. TABELA ANALÍTICA DE FATOS MENSAIS (BI DATA MART)
CREATE TABLE IF NOT EXISTS `fato_vendas_mensal` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ano_mes` VARCHAR(7) NOT NULL UNIQUE,
  `rotulo_mes` VARCHAR(10) NOT NULL,
  `faturamento_bruto` DECIMAL(12,2) NOT NULL,
  `pecas_vendidas` INT NOT NULL,
  `pedidos_concluidos` INT NOT NULL,
  `pedidos_cancelados` INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. MOTIVOS ANALÍTICOS DE CANCELAMENTO
CREATE TABLE IF NOT EXISTS `fato_motivos_cancelamento` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `motivo` VARCHAR(150) NOT NULL UNIQUE,
  `percentual` INT NOT NULL,
  `quantidade` INT NOT NULL,
  `valor_perdido` DECIMAL(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
-- ============================================================
-- BOUTIQUE LAYANI — CARGA INICIAL DE DADOS (SEED SQL)
-- Modelagem: Prisma Analytics (Data & BI Specialist)
-- ============================================================

USE `boutique_layani`;

SET FOREIGN_KEY_CHECKS = 0;

-- 1. SEED DE USUÁRIOS (Hashes bcrypt idênticos aos do store.js)
INSERT INTO `usuarios` (`id`, `uuid`, `nome`, `email`, `senha_hash`, `role`) VALUES
(1, 'usr-admin-1', 'Administradora Layani', 'admin@boutiquelayani.com.br', '$2a$10$7Zrqc1kHQyW8P4ZqB5QZ3eC3Z3Y.9Kx1l0kXzY2.kP1ZqB5QZ3eC3', 'admin'),
(2, 'usr-atendente-1', 'Camila Atendente', 'atendente@boutiquelayani.com.br', '$2a$10$7Zrqc1kHQyW8P4ZqB5QZ3eC3Z3Y.9Kx1l0kXzY2.kP1ZqB5QZ3eC3', 'atendente'),
(3, 'usr-cliente-1', 'Juliana Silva', 'cliente@gmail.com', '$2a$10$7Zrqc1kHQyW8P4ZqB5QZ3eC3Z3Y.9Kx1l0kXzY2.kP1ZqB5QZ3eC3', 'cliente')
ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`);

-- 2. SEED DE CATEGORIAS
INSERT INTO `categorias` (`id`, `nome`, `descricao`) VALUES
(1, 'Vestuário Feminino', 'Moda feminina refinada com inspiração clássica e figurinos de K-Dramas')
ON DUPLICATE KEY UPDATE `nome` = VALUES(`nome`);

-- 3. SEED DE PRODUTOS OFICIAIS
INSERT INTO `produtos` (`id`, `sku`, `nome`, `categoria_id`, `preco_venda`, `custo_unitario`, `tamanho_padrao`, `vibe_dorama`, `descricao_dorama`) VALUES
(1, 'LAY-CAM-001', 'Camiseta Algodão Egípcio', 1, 39.90, 18.00, 'Grade P / M / G', 'Protagonista de Comédia Romântica', 'Inspirada no estilo casual e irresistível das protagonistas de k-dramas em Seul. O visual perfeito para aquele encontro despretensioso em uma cafeteria fofa com o herdeiro chaebol disfarçado. Confortável, versátil e cheia de charme natural!'),
(2, 'LAY-CAL-002', 'Calça Jeans Skinny Flare', 1, 119.90, 55.00, 'Grade 36 a 44', 'Estilo Urbano de Gangnam', 'A clássica calça jeans com caimento impecável, digna das cenas de correria romântica sob o guarda-chuva amarelo ou do dia a dia da mocinha batalhadora que conquista todos pela sua determinação. Uma peça coringa que rouba a cena em qualquer episódio!'),
(3, 'LAY-VES-003', 'Vestido Fluido Midi Dorama', 1, 89.90, 38.00, 'Grade P / M', 'Cena em Câmera Lenta com Trilha Sonora', 'Aquele look marcante do momento em que o vento sopra suavemente e a trilha sonora romântica toca ao fundo. Fluido, delicado e encantador, é perfeito para o grande baile de gala ou para aquele reencontro inesperado sob as cerejeiras em flor!')
ON DUPLICATE KEY UPDATE `preco_venda` = VALUES(`preco_venda`);

-- 4. SEED DE ESTOQUE
INSERT INTO `estoque` (`id`, `produto_id`, `quantidade`, `estoque_minimo`, `status`, `ultima_entrada`) VALUES
(1, 1, 45, 15, 'Em estoque', '2026-10-15'),
(2, 2, 28, 10, 'Em estoque', '2026-10-12'),
(3, 3, 8, 12, 'Estoque baixo', '2026-10-05')
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
