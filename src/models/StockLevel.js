// src/models/StockLevel.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const StockLevel = sequelize.define('stock_levels', {
    id: {
      type:          DataTypes.INTEGER.UNSIGNED,
      primaryKey:    true,
      autoIncrement: true,
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
    quantity: {
      type:         DataTypes.DECIMAL(15, 3),
      allowNull:    false,
      defaultValue: 0,
    },
  }, {
    tableName:  'stock_levels',
    timestamps: true,
    createdAt:  false,
    updatedAt:  'updated_at',
  });

  return StockLevel;
};
