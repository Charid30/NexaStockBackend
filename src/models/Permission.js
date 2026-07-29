// src/models/Permission.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Permission = sequelize.define('permissions', {
    id: {
      type:         DataTypes.CHAR(36),
      primaryKey:   true,
      defaultValue: () => require('crypto').randomUUID(),
    },
    module: {
      type:      DataTypes.STRING(50),
      allowNull: false,
    },
    action: {
      type:      DataTypes.STRING(50),
      allowNull: false,
    },
    label: {
      type:      DataTypes.STRING(100),
      allowNull: false,
    },
  }, {
    tableName:  'permissions',
    timestamps: false,
  });

  return Permission;
};
