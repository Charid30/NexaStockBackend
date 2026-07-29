// src/models/Role.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Role = sequelize.define('roles', {
    id: {
      type:         DataTypes.CHAR(36),
      primaryKey:   true,
      defaultValue: () => require('crypto').randomUUID(),
    },
    type: {
      type:      DataTypes.ENUM('nexalab', 'tenant'),
      allowNull: false,
    },
    name: {
      type:      DataTypes.STRING(50),
      allowNull: false,
      unique:    true,
    },
    label: {
      type:      DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type:      DataTypes.TEXT,
      allowNull: true,
    },
    is_system: {
      type:         DataTypes.TINYINT(1),
      allowNull:    false,
      defaultValue: 0,
    },
    del: {
      type:         DataTypes.TINYINT(1),
      allowNull:    false,
      defaultValue: 0,
    },
  }, {
    tableName:    'roles',
    timestamps:   true,
    createdAt:    'created_at',
    updatedAt:    'updated_at',
    defaultScope: { where: { del: 0 } },
  });

  return Role;
};
