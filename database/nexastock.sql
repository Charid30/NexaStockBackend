-- ============================================================
--  NexaStock — Schéma de base de données
--  Moteur : MySQL / MariaDB
--  Encodage : utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS nexastock
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nexastock;

-- ============================================================
--  1. TENANTS — Entreprises / organisations clientes
-- ============================================================
CREATE TABLE tenants (
  id                    CHAR(36)      NOT NULL,
  name                  VARCHAR(150)  NOT NULL,
  email                 VARCHAR(150)  NULL,
  phone                 VARCHAR(20)   NOT NULL,
  logo_url              VARCHAR(500)  NULL,
  ifu_number            VARCHAR(50)   NULL,
  rccm_number           VARCHAR(50)   NULL,
  is_active    TINYINT(1)   NOT NULL DEFAULT 1,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  del                   TINYINT(1)    NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tenants_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  2. TENANT_MODULES — Modules actifs par tenant
-- ============================================================
CREATE TABLE tenant_modules (
  id           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  tenant_id    CHAR(36)      NOT NULL,
  module_code  ENUM(
    'MULTI_WAREHOUSE',
    'SUPPLIERS',
    'ORDERS',
    'ALERTS',
    'REPORTS',
    'AUDIT_LOG'
  )             NOT NULL,
  is_active    TINYINT(1)    NOT NULL DEFAULT 1,
  activated_at DATETIME      NULL,
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tenant_module (tenant_id, module_code),
  CONSTRAINT fk_tm_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  3. USERS — Utilisateurs de la plateforme
-- ============================================================
CREATE TABLE users (
  id            CHAR(36)     NOT NULL,
  tenant_id     CHAR(36)     NULL,                  -- NULL uniquement pour super_admin
  first_name    VARCHAR(100) NOT NULL,
  last_name     VARCHAR(100) NOT NULL,
  phone         VARCHAR(20)  NOT NULL,
  email         VARCHAR(150) NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM(
    'super_admin',
    'tenant_admin',
    'manager',
    'caissier',
    'magasinier',
    'auditeur',
    'livreur'
  )              NOT NULL DEFAULT 'magasinier',
  is_active     TINYINT(1)  NOT NULL DEFAULT 1,
  last_login_at DATETIME    NULL,
  created_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  del           TINYINT(1)  NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_phone (phone),
  UNIQUE KEY uq_users_email (email),
  KEY idx_users_tenant (tenant_id),
  KEY idx_users_role   (role),
  CONSTRAINT fk_users_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  4. REFRESH_TOKENS — Tokens de rafraîchissement JWT
-- ============================================================
CREATE TABLE refresh_tokens (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    CHAR(36)     NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME     NOT NULL,
  revoked_at DATETIME     NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_rt_user   (user_id),
  KEY idx_rt_token  (token_hash),
  CONSTRAINT fk_rt_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  5. SITES — Boutiques / annexes / entrepôts physiques
-- ============================================================
CREATE TABLE sites (
  id         CHAR(36)     NOT NULL,
  tenant_id  CHAR(36)     NOT NULL,
  name       VARCHAR(150) NOT NULL,
  type       ENUM('siege','annexe','entrepot','boutique') NOT NULL DEFAULT 'boutique',
  address    VARCHAR(300) NULL,
  phone      VARCHAR(20)  NULL,
  email      VARCHAR(150) NULL,
  is_active  TINYINT(1)  NOT NULL DEFAULT 1,
  created_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  del        TINYINT(1)  NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_sites_tenant (tenant_id),
  CONSTRAINT fk_sites_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  6. USER_SITES — Affectation d'un utilisateur à un/plusieurs sites
-- ============================================================
CREATE TABLE user_sites (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    CHAR(36)     NOT NULL,
  site_id    CHAR(36)     NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_site (user_id, site_id),
  CONSTRAINT fk_us_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_us_site FOREIGN KEY (site_id) REFERENCES sites (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  7. CATEGORIES — Catégories de produits (hiérarchiques)
-- ============================================================
CREATE TABLE categories (
  id          CHAR(36)     NOT NULL,
  tenant_id   CHAR(36)     NOT NULL,
  parent_id   CHAR(36)     NULL,
  name        VARCHAR(150) NOT NULL,
  description TEXT         NULL,
  is_active   TINYINT(1)  NOT NULL DEFAULT 1,
  created_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  del         TINYINT(1)  NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_cat_tenant (tenant_id),
  KEY idx_cat_parent (parent_id),
  CONSTRAINT fk_cat_tenant FOREIGN KEY (tenant_id) REFERENCES tenants    (id) ON DELETE CASCADE,
  CONSTRAINT fk_cat_parent FOREIGN KEY (parent_id) REFERENCES categories (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  8. UNITS — Unités de mesure
-- ============================================================
CREATE TABLE units (
  id           CHAR(36)    NOT NULL,
  tenant_id    CHAR(36)    NOT NULL,
  name         VARCHAR(80) NOT NULL,
  abbreviation VARCHAR(10) NOT NULL,
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  created_at   DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  del          TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_units_tenant (tenant_id),
  CONSTRAINT fk_units_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  9. PRODUCTS — Produits
-- ============================================================
CREATE TABLE products (
  id               CHAR(36)       NOT NULL,
  tenant_id        CHAR(36)       NOT NULL,
  category_id      CHAR(36)       NULL,
  unit_id          CHAR(36)       NULL,
  name             VARCHAR(200)   NOT NULL,
  reference        VARCHAR(100)   NULL,
  barcode          VARCHAR(100)   NULL,
  description      TEXT           NULL,
  selling_price    DECIMAL(15,2)  NULL,
  cost_price       DECIMAL(15,2)  NULL,
  min_stock_level  DECIMAL(15,3)  NOT NULL DEFAULT 0,
  image_url        VARCHAR(500)   NULL,
  is_active        TINYINT(1)    NOT NULL DEFAULT 1,
  created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  del              TINYINT(1)    NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_products_tenant   (tenant_id),
  KEY idx_products_category (category_id),
  KEY idx_products_unit     (unit_id),
  KEY idx_products_ref      (reference),
  KEY idx_products_barcode  (barcode),
  CONSTRAINT fk_products_tenant   FOREIGN KEY (tenant_id)   REFERENCES tenants    (id) ON DELETE CASCADE,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
  CONSTRAINT fk_products_unit     FOREIGN KEY (unit_id)     REFERENCES units      (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 10. STOCK_LEVELS — Stock actuel par produit et par site
-- ============================================================
CREATE TABLE stock_levels (
  id         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  tenant_id  CHAR(36)      NOT NULL,
  product_id CHAR(36)      NOT NULL,
  site_id    CHAR(36)      NOT NULL,
  quantity   DECIMAL(15,3) NOT NULL DEFAULT 0,
  updated_at DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_stock_product_site (product_id, site_id),
  KEY idx_sl_tenant  (tenant_id),
  KEY idx_sl_site    (site_id),
  CONSTRAINT fk_sl_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants  (id) ON DELETE CASCADE,
  CONSTRAINT fk_sl_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT fk_sl_site    FOREIGN KEY (site_id)    REFERENCES sites    (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 11. STOCK_MOVEMENTS — Historique de tous les mouvements
-- ============================================================
CREATE TABLE stock_movements (
  id                  CHAR(36)      NOT NULL,
  tenant_id           CHAR(36)      NOT NULL,
  product_id          CHAR(36)      NOT NULL,
  site_id             CHAR(36)      NOT NULL,
  destination_site_id CHAR(36)      NULL,          -- uniquement pour les transferts
  type                ENUM(
    'entree',
    'sortie',
    'transfert',
    'ajustement'
  )                    NOT NULL,
  quantity            DECIMAL(15,3) NOT NULL,
  unit_cost           DECIMAL(15,2) NULL,
  reference           VARCHAR(100)  NULL,           -- n° bon, n° commande...
  note                TEXT          NULL,
  created_by          CHAR(36)      NOT NULL,
  created_at          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_sm_tenant      (tenant_id),
  KEY idx_sm_product     (product_id),
  KEY idx_sm_site        (site_id),
  KEY idx_sm_type        (type),
  KEY idx_sm_created_at  (created_at),
  CONSTRAINT fk_sm_tenant       FOREIGN KEY (tenant_id)           REFERENCES tenants  (id),
  CONSTRAINT fk_sm_product      FOREIGN KEY (product_id)          REFERENCES products (id),
  CONSTRAINT fk_sm_site         FOREIGN KEY (site_id)             REFERENCES sites    (id),
  CONSTRAINT fk_sm_dest_site    FOREIGN KEY (destination_site_id) REFERENCES sites    (id) ON DELETE SET NULL,
  CONSTRAINT fk_sm_created_by   FOREIGN KEY (created_by)          REFERENCES users    (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 12. SUPPLIERS — Fournisseurs (module SUPPLIERS)
-- ============================================================
CREATE TABLE suppliers (
  id             CHAR(36)     NOT NULL,
  tenant_id      CHAR(36)     NOT NULL,
  name           VARCHAR(150) NOT NULL,
  email          VARCHAR(150) NULL,
  phone          VARCHAR(20)  NULL,
  address        VARCHAR(300) NULL,
  contact_person VARCHAR(150) NULL,
  ifu_number     VARCHAR(50)  NULL,
  is_active      TINYINT(1)  NOT NULL DEFAULT 1,
  created_at     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  del            TINYINT(1)  NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_suppliers_tenant (tenant_id),
  CONSTRAINT fk_suppliers_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 13. PURCHASE_ORDERS — Commandes fournisseurs (module ORDERS)
-- ============================================================
CREATE TABLE purchase_orders (
  id            CHAR(36)      NOT NULL,
  tenant_id     CHAR(36)      NOT NULL,
  supplier_id   CHAR(36)      NOT NULL,
  site_id       CHAR(36)      NOT NULL,             -- site destinataire
  reference     VARCHAR(100)  NOT NULL,
  status        ENUM(
    'brouillon',
    'envoyee',
    'recue_partielle',
    'recue_totale',
    'annulee'
  )              NOT NULL DEFAULT 'brouillon',
  order_date    DATE          NOT NULL,
  expected_date DATE          NULL,
  received_date DATE          NULL,
  total_amount  DECIMAL(15,2) NOT NULL DEFAULT 0,
  note          TEXT          NULL,
  created_by    CHAR(36)      NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  del           TINYINT(1)    NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_po_reference (tenant_id, reference),
  KEY idx_po_tenant   (tenant_id),
  KEY idx_po_supplier (supplier_id),
  KEY idx_po_site     (site_id),
  KEY idx_po_status   (status),
  CONSTRAINT fk_po_tenant     FOREIGN KEY (tenant_id)   REFERENCES tenants    (id) ON DELETE CASCADE,
  CONSTRAINT fk_po_supplier   FOREIGN KEY (supplier_id) REFERENCES suppliers  (id),
  CONSTRAINT fk_po_site       FOREIGN KEY (site_id)     REFERENCES sites      (id),
  CONSTRAINT fk_po_created_by FOREIGN KEY (created_by)  REFERENCES users      (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 14. PURCHASE_ORDER_ITEMS — Lignes de commande fournisseur
-- ============================================================
CREATE TABLE purchase_order_items (
  id                INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  purchase_order_id CHAR(36)      NOT NULL,
  product_id        CHAR(36)      NOT NULL,
  quantity_ordered  DECIMAL(15,3) NOT NULL,
  quantity_received DECIMAL(15,3) NOT NULL DEFAULT 0,
  unit_cost         DECIMAL(15,2) NOT NULL,
  total_cost        DECIMAL(15,2) GENERATED ALWAYS AS (quantity_ordered * unit_cost) STORED,
  created_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_poi_order   (purchase_order_id),
  KEY idx_poi_product (product_id),
  CONSTRAINT fk_poi_order   FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders (id) ON DELETE CASCADE,
  CONSTRAINT fk_poi_product FOREIGN KEY (product_id)        REFERENCES products        (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 15. ALERTS — Règles d'alertes de stock (module ALERTS)
-- ============================================================
CREATE TABLE alerts (
  id                 CHAR(36)      NOT NULL,
  tenant_id          CHAR(36)      NOT NULL,
  product_id         CHAR(36)      NOT NULL,
  site_id            CHAR(36)      NULL,             -- NULL = tous les sites
  type               ENUM('stock_bas','rupture')  NOT NULL,
  threshold_quantity DECIMAL(15,3) NOT NULL DEFAULT 0,
  is_active          TINYINT(1)   NOT NULL DEFAULT 1,
  created_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  del                TINYINT(1)   NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY idx_alerts_tenant  (tenant_id),
  KEY idx_alerts_product (product_id),
  KEY idx_alerts_site    (site_id),
  CONSTRAINT fk_alerts_tenant  FOREIGN KEY (tenant_id)  REFERENCES tenants  (id) ON DELETE CASCADE,
  CONSTRAINT fk_alerts_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
  CONSTRAINT fk_alerts_site    FOREIGN KEY (site_id)    REFERENCES sites    (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 16. ALERT_LOGS — Historique des alertes déclenchées
-- ============================================================
CREATE TABLE alert_logs (
  id               INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  alert_id         CHAR(36)      NOT NULL,
  product_id       CHAR(36)      NOT NULL,
  site_id          CHAR(36)      NOT NULL,
  current_quantity DECIMAL(15,3) NOT NULL,
  triggered_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_read          TINYINT(1)   NOT NULL DEFAULT 0,
  read_at          DATETIME     NULL,
  read_by          CHAR(36)     NULL,
  PRIMARY KEY (id),
  KEY idx_al_alert   (alert_id),
  KEY idx_al_product (product_id),
  KEY idx_al_is_read (is_read),
  CONSTRAINT fk_al_alert   FOREIGN KEY (alert_id)   REFERENCES alerts   (id) ON DELETE CASCADE,
  CONSTRAINT fk_al_product FOREIGN KEY (product_id) REFERENCES products (id),
  CONSTRAINT fk_al_site    FOREIGN KEY (site_id)    REFERENCES sites    (id),
  CONSTRAINT fk_al_read_by FOREIGN KEY (read_by)    REFERENCES users    (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 17. SALES — Ventes enregistrées en caisse (module VENTES)
-- ============================================================
CREATE TABLE sales (
  id             CHAR(36)       NOT NULL,
  tenant_id      CHAR(36)       NOT NULL,
  site_id        CHAR(36)       NOT NULL,
  user_id        CHAR(36)       NOT NULL,              -- caissier
  reference      VARCHAR(30)    NOT NULL,
  total_amount   DECIMAL(15, 2) NOT NULL DEFAULT 0,
  payment_method ENUM('especes','mobile_money','carte','cheque') NOT NULL DEFAULT 'especes',
  note           TEXT           NULL,
  del            TINYINT(1)     NOT NULL DEFAULT 0,
  created_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sales_reference (tenant_id, reference),
  KEY idx_sales_tenant     (tenant_id),
  KEY idx_sales_site       (site_id),
  KEY idx_sales_user       (user_id),
  KEY idx_sales_created_at (created_at),
  CONSTRAINT fk_sales_tenant FOREIGN KEY (tenant_id) REFERENCES tenants (id),
  CONSTRAINT fk_sales_site   FOREIGN KEY (site_id)   REFERENCES sites   (id),
  CONSTRAINT fk_sales_user   FOREIGN KEY (user_id)   REFERENCES users   (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 18. SALE_ITEMS — Lignes de vente
-- ============================================================
CREATE TABLE sale_items (
  id         CHAR(36)       NOT NULL,
  sale_id    CHAR(36)       NOT NULL,
  product_id CHAR(36)       NOT NULL,
  quantity   DECIMAL(10, 3) NOT NULL,
  unit_price DECIMAL(12, 2) NOT NULL,
  subtotal   DECIMAL(15, 2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_sale_items_sale    (sale_id),
  KEY idx_sale_items_product (product_id),
  CONSTRAINT fk_sale_items_sale    FOREIGN KEY (sale_id)    REFERENCES sales    (id) ON DELETE CASCADE,
  CONSTRAINT fk_sale_items_product FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  19. ROLES — Définitions des rôles (NexaLab + Tenant)
-- ============================================================
CREATE TABLE IF NOT EXISTS roles (
  id          CHAR(36)     NOT NULL,
  type        ENUM('nexalab','tenant') NOT NULL,
  name        VARCHAR(50)  NOT NULL,
  label       VARCHAR(100) NOT NULL,
  description TEXT         NULL,
  is_system   TINYINT(1)   NOT NULL DEFAULT 0,
  del         TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_role_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  20. PERMISSIONS — Actions disponibles par module
-- ============================================================
CREATE TABLE IF NOT EXISTS permissions (
  id     CHAR(36)     NOT NULL,
  module VARCHAR(50)  NOT NULL,
  action VARCHAR(50)  NOT NULL,
  label  VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_perm (module, action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  21. ROLE_PERMISSIONS — Permissions par rôle
-- ============================================================
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id       CHAR(36) NOT NULL,
  permission_id CHAR(36) NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  CONSTRAINT fk_rp_role FOREIGN KEY (role_id)       REFERENCES roles       (id) ON DELETE CASCADE,
  CONSTRAINT fk_rp_perm FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  Enum role étendu (inclut les rôles NexaLab)
-- ============================================================
-- ALTER TABLE users MODIFY COLUMN role ENUM(
--   'super_admin','nexalab_support','nexalab_commercial','nexalab_technique',
--   'tenant_admin','manager','caissier','magasinier','auditeur','livreur'
-- ) NOT NULL DEFAULT 'magasinier';
