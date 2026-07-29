// src/models/Unit.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Unit = sequelize.define('units', {
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
      type:      DataTypes.STRING(80),
      allowNull: false,
    },
    abbreviation: {
      type:      DataTypes.STRING(10),
      allowNull: false,
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
    tableName:    'units',
    timestamps:   true,
    createdAt:    'created_at',
    updatedAt:    'updated_at',
    defaultScope: { where: { del: 0 } },
  });

  return Unit;
};
