// src/services/alert.service.js
const { Alert, AlertLog, Product, Site } = require('../models');

const list = async (tenantId) => {
  return Alert.findAll({
    where:   { tenant_id: tenantId },
    include: [
      { association: 'product', attributes: ['id', 'name', 'reference'] },
      { association: 'site',    attributes: ['id', 'name'] },
    ],
    order: [['created_at', 'DESC']],
  });
};

const create = async (tenantId, data) => {
  const { product_id, site_id } = data;
  const product = await Product.findOne({ where: { id: product_id, tenant_id: tenantId } });
  if (!product) throw new Error('Produit introuvable');
  if (site_id) {
    const site = await Site.findOne({ where: { id: site_id, tenant_id: tenantId } });
    if (!site) throw new Error('Site introuvable');
  }
  return Alert.create({ ...data, tenant_id: tenantId, site_id: site_id || null });
};

const update = async (tenantId, id, data) => {
  const alert = await Alert.findOne({ where: { id, tenant_id: tenantId } });
  if (!alert) throw new Error('Alerte introuvable');
  await alert.update(data);
  return alert;
};

const remove = async (tenantId, id) => {
  const alert = await Alert.findOne({ where: { id, tenant_id: tenantId } });
  if (!alert) throw new Error('Alerte introuvable');
  await alert.update({ del: 1 });
  return { deleted: true };
};

const getLogs = async (tenantId, { page = 1, limit = 20, unread_only = false }) => {
  const offset = (page - 1) * limit;
  const where  = {};
  if (unread_only) where.is_read = 0;

  const { rows, count } = await AlertLog.findAndCountAll({
    where,
    limit:   parseInt(limit),
    offset,
    order:   [['triggered_at', 'DESC']],
    include: [
      { association: 'alert',   where: { tenant_id: tenantId }, attributes: ['id', 'type', 'threshold_quantity'] },
      { association: 'product', attributes: ['id', 'name'] },
      { association: 'site',    attributes: ['id', 'name'] },
    ],
  });
  return { logs: rows, total: count };
};

const markLogRead = async (tenantId, logId, userId) => {
  const log = await AlertLog.findByPk(logId, {
    include: [{ association: 'alert', where: { tenant_id: tenantId } }],
  });
  if (!log) throw new Error('Log d\'alerte introuvable');
  await log.update({ is_read: 1, read_at: new Date(), read_by: userId });
  return log;
};

module.exports = { list, create, update, remove, getLogs, markLogRead };
