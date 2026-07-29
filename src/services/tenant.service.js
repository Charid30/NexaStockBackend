// src/services/tenant.service.js
const { Tenant, TenantModule, User, Site } = require('../models');

const list = async ({ page = 1, limit = 20, search = '' }) => {
  const offset = (page - 1) * limit;
  const where  = {};
  if (search) {
    const { Op } = require('sequelize');
    where[Op.or] = [
      { name:  { [Op.like]: `%${search}%` } },
      { phone: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }
  const { rows, count } = await Tenant.findAndCountAll({
    where,
    limit:   parseInt(limit),
    offset,
    order:   [['created_at', 'DESC']],
    include: [{ association: 'modules', attributes: ['module_code', 'is_active'] }],
  });
  return { tenants: rows, total: count };
};

const getById = async (id) => {
  const tenant = await Tenant.findByPk(id, {
    include: [
      { association: 'modules' },
      { association: 'sites', where: { is_active: 1 }, required: false },
      { association: 'users', attributes: ['id', 'first_name', 'last_name', 'role', 'is_active'], required: false },
    ],
  });
  if (!tenant) throw new Error('Organisation introuvable');
  return tenant;
};

const update = async (id, data) => {
  const tenant = await Tenant.findByPk(id);
  if (!tenant) throw new Error('Organisation introuvable');
  await tenant.update(data);
  return tenant;
};

const toggleModule = async (tenantId, { module_code, is_active }) => {
  const mod = await TenantModule.findOne({ where: { tenant_id: tenantId, module_code } });
  if (!mod) throw new Error('Module introuvable pour cette organisation');
  await mod.update({ is_active: is_active ? 1 : 0, activated_at: is_active ? new Date() : mod.activated_at });
  return mod;
};

const getMyTenant = async (tenantId) => {
  const tenant = await Tenant.findByPk(tenantId, {
    include: [{ association: 'modules', attributes: ['module_code', 'is_active'] }],
  });
  if (!tenant) throw new Error('Organisation introuvable');
  return tenant;
};

const updateMyTenant = async (tenantId, data) => {
  const tenant = await Tenant.findByPk(tenantId);
  if (!tenant) throw new Error('Organisation introuvable');
  await tenant.update(data);
  return tenant;
};

const getStats = async () => {
  const total   = await Tenant.count();
  const active  = await Tenant.count({ where: { is_active: 1 } });
  const users   = await User.count({ where: { role: { [require('sequelize').Op.ne]: 'super_admin' } } });
  const sites   = await Site.count();
  return { total_tenants: total, active_tenants: active, total_users: users, total_sites: sites };
};

module.exports = { list, getById, update, toggleModule, getStats, getMyTenant, updateMyTenant };
