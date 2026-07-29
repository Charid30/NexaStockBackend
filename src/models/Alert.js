// src/models/Alert.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Alert = sequelize.define('alerts', {
    id: {
      type:         DataTypes.CHAR(36),
      primaryKey:   true,
      defaultValue: () => require('crypto').randomUUID(),
    },
    tenant_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    product_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    site_id: {
      type:      DataTypes.CHAR(36),
      allowNull: true,
    },
    type: {
      type:      DataTypes.ENUM('stock_bas', 'rupture'),
      allowNull: false,
    },
    threshold_quantity: {
      type:         DataTypes.DECIMAL(15, 3),
      allowNull:    false,
      defaultValue: 0,
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
    tableName:    'alerts',
    timestamps:   true,
    createdAt:    'created_at',
    updatedAt:    'updated_at',
    defaultScope: { where: { del: 0 } },
  });

  return Alert;
};
