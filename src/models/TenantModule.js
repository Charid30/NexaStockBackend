// src/models/TenantModule.js
const { DataTypes } = require('sequelize');

const MODULE_CODES = ['MULTI_WAREHOUSE', 'SUPPLIERS', 'ORDERS', 'ALERTS', 'REPORTS', 'AUDIT_LOG'];

module.exports = (sequelize) => {
  const TenantModule = sequelize.define('tenant_modules', {
    id: {
      type:          DataTypes.INTEGER.UNSIGNED,
      primaryKey:    true,
      autoIncrement: true,
    },
    tenant_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    module_code: {
      type:      DataTypes.ENUM(...MODULE_CODES),
      allowNull: false,
    },
    is_active: {
      type:         DataTypes.TINYINT(1),
      allowNull:    false,
      defaultValue: 1,
    },
    activated_at: {
      type:      DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName:  'tenant_modules',
    timestamps: true,
    createdAt:  'created_at',
    updatedAt:  'updated_at',
  });

  TenantModule.MODULE_CODES = MODULE_CODES;

  return TenantModule;
};
