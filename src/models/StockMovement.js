// src/models/StockMovement.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StockMovement = sequelize.define('stock_movements', {
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
      allowNull: false,
    },
    destination_site_id: {
      type:      DataTypes.CHAR(36),
      allowNull: true,
    },
    type: {
      type:      DataTypes.ENUM('entree', 'sortie', 'transfert', 'ajustement'),
      allowNull: false,
    },
    quantity: {
      type:      DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    unit_cost: {
      type:      DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    reference: {
      type:      DataTypes.STRING(100),
      allowNull: true,
    },
    note: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
  }, {
    tableName:  'stock_movements',
    timestamps: true,
    createdAt:  'created_at',
    updatedAt:  false,
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['product_id'] },
      { fields: ['type'] },
      { fields: ['created_at'] },
    ],
  });

  return StockMovement;
};
