// src/models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const ROLES = [
  'super_admin',
  'nexalab_support', 'nexalab_commercial', 'nexalab_technique',
  'tenant_admin', 'manager', 'caissier', 'magasinier', 'auditeur', 'livreur',
];

const NEXALAB_ROLES = ['super_admin', 'nexalab_support', 'nexalab_commercial', 'nexalab_technique'];
const TENANT_ROLES  = ['tenant_admin', 'manager', 'caissier', 'magasinier', 'auditeur', 'livreur'];

module.exports = (sequelize) => {
  const User = sequelize.define('users', {
    id: {
      type:         DataTypes.CHAR(36),
      primaryKey:   true,
      defaultValue: () => require('crypto').randomUUID(),
    },
    tenant_id: {
      type:      DataTypes.CHAR(36),
      allowNull: true,
    },
    first_name: {
      type:      DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type:      DataTypes.STRING(100),
      allowNull: false,
    },
    phone: {
      type:      DataTypes.STRING(20),
      allowNull: false,
      unique:    true,
    },
    email: {
      type:      DataTypes.STRING(150),
      allowNull: true,
      unique:    true,
    },
    password_hash: {
      type:      DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type:         DataTypes.ENUM(...ROLES),
      allowNull:    false,
      defaultValue: 'magasinier',
    },
    is_active: {
      type:         DataTypes.TINYINT(1),
      allowNull:    false,
      defaultValue: 1,
    },
    last_login_at: {
      type:      DataTypes.DATE,
      allowNull: true,
    },
    del: {
      type:         DataTypes.TINYINT(1),
      allowNull:    false,
      defaultValue: 0,
    },
  }, {
    tableName:    'users',
    timestamps:   true,
    createdAt:    'created_at',
    updatedAt:    'updated_at',
    defaultScope: { where: { del: 0 } },
    indexes: [
      { fields: ['tenant_id'] },
      { fields: ['role'] },
    ],
  });

  User.addHook('beforeCreate', async (user) => {
    if (user.password_hash) {
      user.password_hash = await bcrypt.hash(user.password_hash, 12);
    }
  });

  User.addHook('beforeUpdate', async (user) => {
    if (user.changed('password_hash') && user.password_hash) {
      user.password_hash = await bcrypt.hash(user.password_hash, 12);
    }
  });

  User.prototype.comparePassword = async function (plain) {
    return bcrypt.compare(plain, this.password_hash);
  };

  User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password_hash;
    return values;
  };

  User.ROLES         = ROLES;
  User.NEXALAB_ROLES = NEXALAB_ROLES;
  User.TENANT_ROLES  = TENANT_ROLES;

  return User;
};
