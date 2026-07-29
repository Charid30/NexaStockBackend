// src/models/Product.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Product = sequelize.define('products', {
    id: {
      type:         DataTypes.CHAR(36),
      primaryKey:   true,
      defaultValue: () => require('crypto').randomUUID(),
    },
    tenant_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    category_id: {
      type:      DataTypes.CHAR(36),
      allowNull: true,
    },
    unit_id: {
      type:      DataTypes.CHAR(36),
      allowNull: true,
    },
    name: {
      type:      DataTypes.STRING(200),
      allowNull: false,
    },
    reference: {
      type:      DataTypes.STRING(100),
      allowNull: true,
    },
    barcode: {
      type:      DataTypes.STRING(100),
      allowNull: true,
    },
    description: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    selling_price: {
      type:      DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    cost_price: {
      type:      DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    min_stock_level: {
      type:         DataTypes.DECIMAL(15, 3),
      allowNull:    false,
      defaultValue: 0,
    },
    image_url: {
      type:      DataTypes.STRING(500),
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
    tableName:    'products',
    timestamps:   true,
    createdAt:    'created_at',
    updatedAt:    'updated_at',
    defaultScope: { where: { del: 0 } },
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['reference'] },
      { fields: ['barcode'] },
    ],
  });

  return Product;
};
