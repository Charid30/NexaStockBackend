-- ============================================================
--  Migration 019 — Rôles, permissions et équipe NexaLab
-- ============================================================

USE nexastock;

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
  CONSTRAINT fk_rp_role FOREIGN KEY (role_id)       REFERENCES roles (id)       ON DELETE CASCADE,
  CONSTRAINT fk_rp_perm FOREIGN KEY (permission_id) REFERENCES permissions (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
--  Étendre l'enum role dans users
-- ============================================================
ALTER TABLE users
  MODIFY COLUMN role ENUM(
    'super_admin',
    'nexalab_support',
    'nexalab_commercial',
    'nexalab_technique',
    'tenant_admin',
    'manager',
    'caissier',
    'magasinier',
    'auditeur',
    'livreur'
  ) NOT NULL DEFAULT 'magasinier';
