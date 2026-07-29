// src/models/RefreshToken.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RefreshToken = sequelize.define('refresh_tokens', {
    id: {
      type:          DataTypes.INTEGER.UNSIGNED,
      primaryKey:    true,
      autoIncrement: true,
    },
    user_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    token_hash: {
      type:      DataTypes.STRING(255),
      allowNull: false,
    },
    expires_at: {
      type:      DataTypes.DATE,
      allowNull: false,
    },
    revoked_at: {
      type:      DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName:  'refresh_tokens',
    timestamps: true,
    createdAt:  'created_at',
    updatedAt:  false,
  });

  return RefreshToken;
};
