// src/models/PurchaseOrder.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PurchaseOrder = sequelize.define('purchase_orders', {
    id: {
      type:         DataTypes.CHAR(36),
      primaryKey:   true,
      defaultValue: () => require('crypto').randomUUID(),
    },
    tenant_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    supplier_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    site_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    reference: {
      type:      DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type:         DataTypes.ENUM('brouillon', 'envoyee', 'recue_partielle', 'recue_totale', 'annulee'),
      allowNull:    false,
      defaultValue: 'brouillon',
    },
    order_date: {
      type:      DataTypes.DATEONLY,
      allowNull: false,
    },
    expected_date: {
      type:      DataTypes.DATEONLY,
      allowNull: true,
    },
    received_date: {
      type:      DataTypes.DATEONLY,
      allowNull: true,
    },
    total_amount: {
      type:         DataTypes.DECIMAL(15, 2),
      allowNull:    false,
      defaultValue: 0,
    },
    note: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    del: {
      type:         DataTypes.TINYINT(1),
      allowNull:    false,
      defaultValue: 0,
    },
  }, {
    tableName:    'purchase_orders',
    timestamps:   true,
    createdAt:    'created_at',
    updatedAt:    'updated_at',
    defaultScope: { where: { del: 0 } },
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['status'] },
    ],
  });

  return PurchaseOrder;
};
