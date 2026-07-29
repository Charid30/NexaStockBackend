// src/services/supplier.service.js
const { Supplier } = require('../models');
const { Op } = require('sequelize');

const list = async (tenantId, { page = 1, limit = 20, search = '' }) => {
  const offset = (page - 1) * limit;
  const where  = { tenant_id: tenantId };
  if (search) where[Op.or] = [
    { name:  { [Op.like]: `%${search}%` } },
    { phone: { [Op.like]: `%${search}%` } },
    { email: { [Op.like]: `%${search}%` } },
  ];
  const { rows, count } = await Supplier.findAndCountAll({ where, limit: parseInt(limit), offset, order: [['name', 'ASC']] });
  return { suppliers: rows, total: count };
};

const getById = async (tenantId, id) => {
  const s = await Supplier.findOne({ where: { id, tenant_id: tenantId } });
  if (!s) throw new Error('Fournisseur introuvable');
  return s;
};

const create = async (tenantId, data) => Supplier.create({ ...data, tenant_id: tenantId });

const update = async (tenantId, id, data) => {
  const s = await Supplier.findOne({ where: { id, tenant_id: tenantId } });
  if (!s) throw new Error('Fournisseur introuvable');
  await s.update(data);
  return s;
};

const remove = async (tenantId, id) => {
  const s = await Supplier.findOne({ where: { id, tenant_id: tenantId } });
  if (!s) throw new Error('Fournisseur introuvable');
  const { PurchaseOrder } = require('../models');
  const hasOrders = await PurchaseOrder.count({ where: { supplier_id: id } });
  if (hasOrders) throw new Error('Impossible de supprimer un fournisseur lié à des commandes');
  await s.update({ del: 1 });
  return { deleted: true };
};

module.exports = { list, getById, create, update, remove };
