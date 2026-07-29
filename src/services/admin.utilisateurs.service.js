// src/services/admin.utilisateurs.service.js
const { User, Tenant } = require('../models');
const { Op }           = require('sequelize');

const TENANT_ROLES = ['tenant_admin', 'manager', 'caissier', 'magasinier', 'auditeur', 'livreur'];

const list = async ({ page = 1, limit = 20, search, tenant_id, role, is_active }) => {
  const where = { role: { [Op.in]: TENANT_ROLES } };

  if (tenant_id)             where.tenant_id = tenant_id;
  if (role && TENANT_ROLES.includes(role)) where.role = role;
  if (is_active !== undefined && is_active !== '') where.is_active = Number(is_active);

  if (search) {
    where[Op.or] = [
      { first_name: { [Op.like]: `%${search}%` } },
      { last_name:  { [Op.like]: `%${search}%` } },
      { phone:      { [Op.like]: `%${search}%` } },
      { email:      { [Op.like]: `%${search}%` } },
    ];
  }

  const offset = (Number(page) - 1) * Number(limit);
  const { count, rows } = await User.findAndCountAll({
    where,
    include: [{ association: 'tenant', attributes: ['id', 'name'], required: false }],
    order:   [['created_at', 'DESC']],
    limit:   Number(limit),
    offset,
  });

  return { total: count, page: Number(page), limit: Number(limit), data: rows };
};

const toggleStatus = async (id) => {
  const user = await User.findOne({ where: { id, role: { [Op.in]: TENANT_ROLES } } });
  if (!user) throw new Error('Utilisateur introuvable');
  await user.update({ is_active: user.is_active ? 0 : 1 });
  return user;
};

module.exports = { list, toggleStatus };
