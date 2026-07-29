// src/models/Tenant.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tenant = sequelize.define('tenants', {
    id: {
      type:         DataTypes.CHAR(36),
      primaryKey:   true,
      defaultValue: () => require('crypto').randomUUID(),
    },
    name: {
      type:      DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type:      DataTypes.STRING(150),
      allowNull: true,
      unique:    true,
    },
    phone: {
      type:      DataTypes.STRING(20),
      allowNull: false,
    },
    logo_url: {
      type:      DataTypes.STRING(500),
      allowNull: true,
    },
    ifu_number: {
      type:      DataTypes.STRING(50),
      allowNull: true,
    },
    rccm_number: {
      type:      DataTypes.STRING(50),
      allowNull: true,
    },
    is_active: {
      type:         DataTypes.TINYINT(1),
      allowNull:    false,
      defaultValue: 1,
    },
    del: {
      type:         DataTypes.TINYINT(1),
      allowNull:    false,
      defaultValue: 0,
    },
  }, {
    tableName:    'tenants',
    timestamps:   true,
    createdAt:    'created_at',
    updatedAt:    'updated_at',
    defaultScope: { where: { del: 0 } },
  });

  return Tenant;
};
