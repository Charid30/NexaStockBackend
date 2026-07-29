// src/models/Supplier.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Supplier = sequelize.define('suppliers', {
    id: {
      type:         DataTypes.CHAR(36),
      primaryKey:   true,
      defaultValue: () => require('crypto').randomUUID(),
    },
    tenant_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    name: {
      type:      DataTypes.STRING(150),
      allowNull: false,
    },
    email: {
      type:      DataTypes.STRING(150),
      allowNull: true,
    },
    phone: {
      type:      DataTypes.STRING(20),
      allowNull: true,
    },
    address: {
      type:      DataTypes.STRING(300),
      allowNull: true,
    },
    contact_person: {
      type:      DataTypes.STRING(150),
      allowNull: true,
    },
    ifu_number: {
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
    tableName:    'suppliers',
    timestamps:   true,
    createdAt:    'created_at',
    updatedAt:    'updated_at',
    defaultScope: { where: { del: 0 } },
  });

  return Supplier;
};
