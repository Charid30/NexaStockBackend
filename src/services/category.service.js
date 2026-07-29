// src/services/category.service.js
const { Category } = require('../models');

const list = async (tenantId) => {
  return Category.findAll({
    where: { tenant_id: tenantId },
    order: [['name', 'ASC']],
  });
};

const getById = async (tenantId, id) => {
  const cat = await Category.findOne({
    where:   { id, tenant_id: tenantId },
    include: [
      { association: 'parent',   attributes: ['id', 'name'] },
      { association: 'children', attributes: ['id', 'name', 'is_active'] },
    ],
  });
  if (!cat) throw new Error('Catégorie introuvable');
  return cat;
};

const create = async (tenantId, data) => {
  if (data.parent_id) {
    const parent = await Category.findOne({ where: { id: data.parent_id, tenant_id: tenantId } });
    if (!parent) throw new Error('Catégorie parente introuvable');
  }
  return Category.create({ ...data, tenant_id: tenantId });
};

const update = async (tenantId, id, data) => {
  const cat = await Category.findOne({ where: { id, tenant_id: tenantId } });
  if (!cat) throw new Error('Catégorie introuvable');
  if (data.parent_id === id) throw new Error('Une catégorie ne peut pas être sa propre parente');
  await cat.update(data);
  return cat;
};

const remove = async (tenantId, id) => {
  const cat = await Category.findOne({ where: { id, tenant_id: tenantId } });
  if (!cat) throw new Error('Catégorie introuvable');
  const hasChildren = await Category.count({ where: { parent_id: id } });
  if (hasChildren) throw new Error('Impossible de supprimer une catégorie qui contient des sous-catégories');
  await cat.update({ del: 1 });
  return { deleted: true };
};

module.exports = { list, getById, create, update, remove };
