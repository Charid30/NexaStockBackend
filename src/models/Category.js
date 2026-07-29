// src/models/Category.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Category = sequelize.define('categories', {
    id: {
      type:         DataTypes.CHAR(36),
      primaryKey:   true,
      defaultValue: () => require('crypto').randomUUID(),
    },
    tenant_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    parent_id: {
      type:      DataTypes.CHAR(36),
      allowNull: true,
    },
    name: {
      type:      DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type:      DataTypes.TEXT,
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
    tableName:    'categories',
    timestamps:   true,
    createdAt:    'created_at',
    updatedAt:    'updated_at',
    defaultScope: { where: { del: 0 } },
  });

  return Category;
};
