-- ============================================================
--  Migration : remplacement de deleted_at par del
--  del = 0 : enregistrement actif
--  del = 1 : supprimé logiquement
--  À exécuter UNE SEULE FOIS sur la base existante
-- ============================================================

USE nexastock;

ALTER TABLE tenants         DROP COLUMN deleted_at, ADD COLUMN del TINYINT(1) NOT NULL DEFAULT 0 AFTER updated_at;
ALTER TABLE users           DROP COLUMN deleted_at, ADD COLUMN del TINYINT(1) NOT NULL DEFAULT 0 AFTER updated_at;
ALTER TABLE sites           DROP COLUMN deleted_at, ADD COLUMN del TINYINT(1) NOT NULL DEFAULT 0 AFTER updated_at;
ALTER TABLE categories      DROP COLUMN deleted_at, ADD COLUMN del TINYINT(1) NOT NULL DEFAULT 0 AFTER updated_at;
ALTER TABLE units           DROP COLUMN deleted_at, ADD COLUMN del TINYINT(1) NOT NULL DEFAULT 0 AFTER updated_at;
ALTER TABLE products        DROP COLUMN deleted_at, ADD COLUMN del TINYINT(1) NOT NULL DEFAULT 0 AFTER updated_at;
ALTER TABLE suppliers       DROP COLUMN deleted_at, ADD COLUMN del TINYINT(1) NOT NULL DEFAULT 0 AFTER updated_at;
ALTER TABLE purchase_orders DROP COLUMN deleted_at, ADD COLUMN del TINYINT(1) NOT NULL DEFAULT 0 AFTER updated_at;
ALTER TABLE alerts          DROP COLUMN deleted_at, ADD COLUMN del TINYINT(1) NOT NULL DEFAULT 0 AFTER updated_at;
