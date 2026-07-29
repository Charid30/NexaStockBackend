// src/services/admin.agent.service.js
const { User } = require('../models');
const { Op }   = require('sequelize');

const NEXALAB_ROLES = ['nexalab_support', 'nexalab_commercial', 'nexalab_technique'];

const list = async ({ page = 1, limit = 20, search, role }) => {
  const where = { tenant_id: null, role: { [Op.in]: NEXALAB_ROLES } };

  if (role && NEXALAB_ROLES.includes(role)) where.role = role;

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
    order:  [['created_at', 'DESC']],
    limit:  Number(limit),
    offset,
  });

  return { total: count, page: Number(page), limit: Number(limit), data: rows };
};

const create = async (data) => {
  const { first_name, last_name, phone, email, password, role } = data;

  const existing = await User.findOne({ where: { phone } });
  if (existing) throw new Error('Ce numéro de téléphone est déjà utilisé');

  if (email) {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) throw new Error('Cette adresse email est déjà utilisée');
  }

  const agent = await User.create({
    tenant_id:     null,
    first_name,
    last_name,
    phone,
    email:         email || null,
    password_hash: password,
    role,
    is_active:     1,
  });

  return agent;
};

const update = async (id, data) => {
  const agent = await User.findOne({ where: { id, tenant_id: null, role: { [Op.in]: NEXALAB_ROLES } } });
  if (!agent) throw new Error('Agent introuvable');

  const { first_name, last_name, phone, email, role, is_active, password } = data;

  if (phone && phone !== agent.phone) {
    const existing = await User.findOne({ where: { phone } });
    if (existing) throw new Error('Ce numéro de téléphone est déjà utilisé');
  }

  const updates = {};
  if (first_name  !== undefined) updates.first_name  = first_name;
  if (last_name   !== undefined) updates.last_name   = last_name;
  if (phone       !== undefined) updates.phone       = phone;
  if (email       !== undefined) updates.email       = email || null;
  if (role        !== undefined) updates.role        = role;
  if (is_active   !== undefined) updates.is_active   = is_active;
  if (password)                  updates.password_hash = password;

  await agent.update(updates);
  return agent;
};

const toggleStatus = async (id) => {
  const agent = await User.findOne({ where: { id, tenant_id: null, role: { [Op.in]: NEXALAB_ROLES } } });
  if (!agent) throw new Error('Agent introuvable');
  await agent.update({ is_active: agent.is_active ? 0 : 1 });
  return agent;
};

const remove = async (id) => {
  const agent = await User.findOne({ where: { id, tenant_id: null, role: { [Op.in]: NEXALAB_ROLES } } });
  if (!agent) throw new Error('Agent introuvable');
  await agent.update({ del: 1 });
  return { deleted: true };
};

module.exports = { list, create, update, toggleStatus, remove };
