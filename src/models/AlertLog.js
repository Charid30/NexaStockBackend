// src/models/AlertLog.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AlertLog = sequelize.define('alert_logs', {
    id: {
      type:          DataTypes.INTEGER.UNSIGNED,
      primaryKey:    true,
      autoIncrement: true,
    },
    alert_id: {
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
    current_quantity: {
      type:      DataTypes.DECIMAL(15, 3),
      allowNull: false,
    },
    triggered_at: {
      type:         DataTypes.DATE,
      allowNull:    false,
      defaultValue: DataTypes.NOW,
    },
    is_read: {
      type:         DataTypes.TINYINT(1),
      allowNull:    false,
      defaultValue: 0,
    },
    read_at: {
      type:      DataTypes.DATE,
      allowNull: true,
    },
    read_by: {
      type:      DataTypes.CHAR(36),
      allowNull: true,
    },
  }, {
    tableName:  'alert_logs',
    timestamps: false,
  });

  return AlertLog;
};
