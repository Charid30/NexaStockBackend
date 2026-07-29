// src/scripts/seedSuperAdmin.js
require('dotenv').config();
const { sequelize, User } = require('../models');

const seed = async () => {
  try {
    await sequelize.authenticate();

    const existing = await User.findOne({ where: { role: 'super_admin' } });
    if (existing) {
      console.log('Un super_admin existe déjà :', existing.phone);
      process.exit(0);
    }

    const admin = await User.create({
      first_name:    'Super',
      last_name:     'Admin',
      phone:         process.env.SUPER_ADMIN_PHONE || '+22600000000',
      email:         process.env.SUPER_ADMIN_EMAIL || 'admin@nexastock.com',
      password_hash: process.env.SUPER_ADMIN_PASSWORD || 'Admin@1234',
      role:          'super_admin',
      tenant_id:     null,
    });

    console.log('Super admin créé avec succès :');
    console.log('  Téléphone :', admin.phone);
    console.log('  Email     :', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de la création du super admin :', err.message);
    process.exit(1);
  }
};

seed();
