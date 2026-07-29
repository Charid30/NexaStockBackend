-- ============================================================
--  Migration : ajout de la suppression logique (soft delete)
--  Ajoute la colonne deleted_at sur 9 tables
--  À exécuter UNE SEULE FOIS sur la base existante
-- ============================================================

USE nexastock;

ALTER TABLE tenants         ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL AFTER updated_at;
ALTER TABLE users           ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL AFTER updated_at;
ALTER TABLE sites           ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL AFTER updated_at;
ALTER TABLE categories      ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL AFTER updated_at;
ALTER TABLE units           ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL AFTER updated_at;
ALTER TABLE products        ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL AFTER updated_at;
ALTER TABLE suppliers       ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL AFTER updated_at;
ALTER TABLE purchase_orders ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL AFTER updated_at;
ALTER TABLE alerts          ADD COLUMN deleted_at DATETIME NULL DEFAULT NULL AFTER updated_at;
