// src/services/user.service.js
const { sequelize, User, Site, UserSite } = require('../models');
const { Op } = require('sequelize');

const SITE_INCLUDE = {
  model:      Site,
  as:         'sites',
  attributes: ['id', 'name', 'type'],
  through:    { attributes: [] },
  required:   false,
};

const list = async (tenantId, { page = 1, limit = 20, search = '', role = '' }) => {
  const offset = (page - 1) * limit;
  const where  = { tenant_id: tenantId };
  if (role)   where.role   = role;
  if (search) where[Op.or] = [
    { first_name: { [Op.like]: `%${search}%` } },
    { last_name:  { [Op.like]: `%${search}%` } },
    { phone:      { [Op.like]: `%${search}%` } },
  ];

  const total = await User.count({ where });
  const rows  = await User.findAll({
    where,
    limit:   parseInt(limit),
    offset,
    order:   [['created_at', 'DESC']],
    include: [SITE_INCLUDE],
  });
  return { users: rows, total };
};

const getById = async (tenantId, userId) => {
  const user = await User.findOne({
    where:   { id: userId, tenant_id: tenantId },
    include: [SITE_INCLUDE],
  });
  if (!user) throw new Error('Utilisateur introuvable');
  return user;
};

const create = async (tenantId, data) => {
  const { first_name, last_name, phone, email, role, password, site_ids = [] } = data;

  const existing = await User.findOne({ where: { phone } });
  if (existing) throw new Error('Ce numéro de téléphone est déjà utilisé');

  if (email) {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) throw new Error('Cette adresse email est déjà utilisée');
  }

  if (site_ids.length) {
    const validSites = await Site.findAll({ where: { id: site_ids, tenant_id: tenantId } });
    if (validSites.length !== site_ids.length) throw new Error('Un ou plusieurs sites sont invalides');
  }

  const t = await sequelize.transaction();
  try {
    const user = await User.create({
      tenant_id:     tenantId,
      first_name,
      last_name,
      phone,
      email:         email || null,
      password_hash: password,
      role,
    }, { transaction: t });

    if (site_ids.length) {
      await UserSite.bulkCreate(
        site_ids.map((site_id) => ({ user_id: user.id, site_id })),
        { transaction: t },
      );
    }

    await t.commit();
    return { id: user.id, first_name, last_name, phone, email, role };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const update = async (tenantId, userId, data) => {
  const { site_ids, ...userFields } = data;

  const user = await User.findOne({ where: { id: userId, tenant_id: tenantId } });
  if (!user) throw new Error('Utilisateur introuvable');

  if (site_ids !== undefined && site_ids.length) {
    const validSites = await Site.findAll({ where: { id: site_ids, tenant_id: tenantId } });
    if (validSites.length !== site_ids.length) throw new Error('Un ou plusieurs sites sont invalides');
  }

  const t = await sequelize.transaction();
  try {
    await user.update(userFields, { transaction: t });

    if (site_ids !== undefined) {
      await UserSite.destroy({ where: { user_id: userId }, transaction: t });
      if (site_ids.length) {
        await UserSite.bulkCreate(
          site_ids.map((site_id) => ({ user_id: userId, site_id })),
          { transaction: t },
        );
      }
    }

    await t.commit();
    return { id: userId };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const assignSites = async (tenantId, userId, { site_ids }) => {
  const user = await User.findOne({ where: { id: userId, tenant_id: tenantId } });
  if (!user) throw new Error('Utilisateur introuvable');

  if (site_ids.length) {
    const validSites = await Site.findAll({ where: { id: site_ids, tenant_id: tenantId } });
    if (validSites.length !== site_ids.length) throw new Error('Un ou plusieurs sites sont invalides');
  }

  await UserSite.destroy({ where: { user_id: userId } });
  if (site_ids.length) {
    await UserSite.bulkCreate(site_ids.map((site_id) => ({ user_id: userId, site_id })));
  }

  return { id: userId };
};

const remove = async (tenantId, userId, requesterId) => {
  if (userId === requesterId) throw new Error('Vous ne pouvez pas supprimer votre propre compte');
  const user = await User.findOne({ where: { id: userId, tenant_id: tenantId } });
  if (!user) throw new Error('Utilisateur introuvable');
  await user.update({ del: 1 });
  return { deleted: true };
};

const updateProfile = async (userId, data) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('Utilisateur introuvable');
  await user.update(data);
  return user;
};

module.exports = { list, getById, create, update, assignSites, remove, updateProfile };
