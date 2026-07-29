const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SaleItem = sequelize.define('sale_items', {
    id: {
      type:         DataTypes.CHAR(36),
      primaryKey:   true,
      defaultValue: () => require('crypto').randomUUID(),
    },
    sale_id:    { type: DataTypes.CHAR(36), allowNull: false },
    product_id: { type: DataTypes.CHAR(36), allowNull: false },
    quantity:   { type: DataTypes.DECIMAL(10, 3), allowNull: false },
    unit_price: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    subtotal:   { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  }, {
    tableName:  'sale_items',
    timestamps: false,
    indexes: [
      { fields: ['sale_id'] },
      { fields: ['product_id'] },
    ],
  });

  return SaleItem;
};
