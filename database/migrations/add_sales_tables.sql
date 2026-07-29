-- ============================================================
--  NexaStock — Migration : module Ventes
--  Tables : sales, sale_items
-- ============================================================

USE nexastock;

CREATE TABLE IF NOT EXISTS `sales` (
  `id`             CHAR(36)        NOT NULL,
  `tenant_id`      CHAR(36)        NOT NULL,
  `site_id`        CHAR(36)        NOT NULL,
  `user_id`        CHAR(36)        NOT NULL,
  `reference`      VARCHAR(30)     NOT NULL,
  `total_amount`   DECIMAL(15, 2)  NOT NULL DEFAULT 0,
  `payment_method` ENUM('especes','mobile_money','carte','cheque') NOT NULL DEFAULT 'especes',
  `note`           TEXT            NULL,
  `del`            TINYINT(1)      NOT NULL DEFAULT 0,
  `created_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_sales_tenant`     (`tenant_id`),
  INDEX `idx_sales_site`       (`site_id`),
  INDEX `idx_sales_user`       (`user_id`),
  INDEX `idx_sales_created_at` (`created_at`),
  CONSTRAINT `fk_sales_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants` (`id`),
  CONSTRAINT `fk_sales_site`   FOREIGN KEY (`site_id`)   REFERENCES `sites`   (`id`),
  CONSTRAINT `fk_sales_user`   FOREIGN KEY (`user_id`)   REFERENCES `users`   (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sale_items` (
  `id`         CHAR(36)       NOT NULL,
  `sale_id`    CHAR(36)       NOT NULL,
  `product_id` CHAR(36)       NOT NULL,
  `quantity`   DECIMAL(10, 3) NOT NULL,
  `unit_price` DECIMAL(12, 2) NOT NULL,
  `subtotal`   DECIMAL(15, 2) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `idx_sale_items_sale`    (`sale_id`),
  INDEX `idx_sale_items_product` (`product_id`),
  CONSTRAINT `fk_sale_items_sale`    FOREIGN KEY (`sale_id`)    REFERENCES `sales`    (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sale_items_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
