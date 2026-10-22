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
