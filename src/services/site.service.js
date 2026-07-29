// src/services/site.service.js
const { Site, User, StockLevel } = require('../models');

const list = async (tenantId) => {
  return Site.findAll({
    where: { tenant_id: tenantId },
    order: [['created_at', 'ASC']],
  });
};

const getById = async (tenantId, siteId) => {
  const site = await Site.findOne({
    where: { id: siteId, tenant_id: tenantId },
    include: [{ association: 'users', attributes: ['id', 'first_name', 'last_name', 'role'], through: { attributes: [] } }],
  });
  if (!site) throw new Error('Site introuvable');
  return site;
};

const create = async (tenantId, data) => {
  return Site.create({ ...data, tenant_id: tenantId });
};

const update = async (tenantId, siteId, data) => {
  const site = await Site.findOne({ where: { id: siteId, tenant_id: tenantId } });
  if (!site) throw new Error('Site introuvable');
  await site.update(data);
  return site;
};

const remove = async (tenantId, siteId) => {
  const site = await Site.findOne({ where: { id: siteId, tenant_id: tenantId } });
  if (!site) throw new Error('Site introuvable');

  const hasStock = await StockLevel.findOne({ where: { site_id: siteId } });
  if (hasStock) throw new Error('Impossible de supprimer un site qui possède du stock');

  await site.update({ del: 1 });
  return { deleted: true };
};

module.exports = { list, getById, create, update, remove };
