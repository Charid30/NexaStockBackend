// src/services/unit.service.js
const { Unit } = require('../models');

const list = async (tenantId) => {
  return Unit.findAll({ where: { tenant_id: tenantId }, order: [['name', 'ASC']] });
};

const create = async (tenantId, data) => {
  return Unit.create({ ...data, tenant_id: tenantId });
};

const update = async (tenantId, id, data) => {
  const unit = await Unit.findOne({ where: { id, tenant_id: tenantId } });
  if (!unit) throw new Error('Unité introuvable');
  await unit.update(data);
  return unit;
};

const remove = async (tenantId, id) => {
  const unit = await Unit.findOne({ where: { id, tenant_id: tenantId } });
  if (!unit) throw new Error('Unité introuvable');
  const { Product } = require('../models');
  const hasProducts = await Product.count({ where: { unit_id: id } });
  if (hasProducts) throw new Error('Impossible de supprimer une unité utilisée par des produits');
  await unit.update({ del: 1 });
  return { deleted: true };
};

module.exports = { list, create, update, remove };
