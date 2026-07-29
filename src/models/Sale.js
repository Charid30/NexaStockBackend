const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Sale = sequelize.define('sales', {
    id: {
      type:         DataTypes.CHAR(36),
      primaryKey:   true,
      defaultValue: () => require('crypto').randomUUID(),
    },
    tenant_id:      { type: DataTypes.CHAR(36), allowNull: false },
    site_id:        { type: DataTypes.CHAR(36), allowNull: false },
    user_id:        { type: DataTypes.CHAR(36), allowNull: false },
    reference:      { type: DataTypes.STRING(30), allowNull: false },
    total_amount:   { type: DataTypes.DECIMAL(15, 2), allowNull: false, defaultValue: 0 },
    payment_method: {
      type:         DataTypes.ENUM('especes', 'mobile_money', 'carte', 'cheque'),
      allowNull:    false,
      defaultValue: 'especes',
    },
    note: { type: DataTypes.TEXT, allowNull: true },
    del:  { type: DataTypes.TINYINT(1), allowNull: false, defaultValue: 0 },
  }, {
    tableName:    'sales',
    timestamps:   true,
    createdAt:    'created_at',
    updatedAt:    'updated_at',
    defaultScope: { where: { del: 0 } },
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['site_id'] },
      { fields: ['user_id'] },
      { fields: ['created_at'] },
    ],
  });

  return Sale;
};
