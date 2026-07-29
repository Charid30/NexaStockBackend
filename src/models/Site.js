// src/models/Site.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Site = sequelize.define('sites', {
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
      type:      DataTypes.STRING(150),
      allowNull: false,
    },
    type: {
      type:         DataTypes.ENUM('siege', 'annexe', 'entrepot', 'boutique'),
      allowNull:    false,
      defaultValue: 'boutique',
    },
    address: {
      type:      DataTypes.STRING(300),
      allowNull: true,
    },
    phone: {
      type:      DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type:      DataTypes.STRING(150),
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
    tableName:    'sites',
    timestamps:   true,
    createdAt:    'created_at',
    updatedAt:    'updated_at',
    defaultScope: { where: { del: 0 } },
    indexes: [{ fields: ['tenant_id'] }],
  });

  return Site;
};
