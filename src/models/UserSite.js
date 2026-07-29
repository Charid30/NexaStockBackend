// src/models/UserSite.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const UserSite = sequelize.define('user_sites', {
    id: {
      type:          DataTypes.INTEGER.UNSIGNED,
      primaryKey:    true,
      autoIncrement: true,
    },
    user_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
    site_id: {
      type:      DataTypes.CHAR(36),
      allowNull: false,
    },
  }, {
    tableName:  'user_sites',
    timestamps: true,
    createdAt:  'created_at',
    updatedAt:  false,
  });

  return UserSite;
};
