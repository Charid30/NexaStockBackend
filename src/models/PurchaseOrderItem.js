// src/models/PurchaseOrderItem.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PurchaseOrderItem = sequelize.define('purchase_order_items', {
    id: {
      type:          DataTypes.INTEGER.UNSIGNED,
      primaryKey:    true,
      autoIncrement: true,
    },
    purchase_order_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    product_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    quantity_ordered: {
      type:      DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    quantity_received: {
      type:         DataTypes.DECIMAL(15, 3),
      allowNull:    false,
      defaultValue: 0,
    },
    unit_cost: {
      type:      DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
  }, {
    tableName:  'purchase_order_items',
    timestamps: true,
    createdAt:  'created_at',
    updatedAt:  'updated_at',
  });

  return PurchaseOrderItem;
};
