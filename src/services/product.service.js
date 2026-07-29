// src/services/product.service.js
const { Product, StockLevel, Site } = require('../models');
const { Op } = require('sequelize');

const list = async (tenantId, { page = 1, limit = 20, search = '', category_id = '', active_only = true }) => {
  const offset = (page - 1) * limit;
  const where  = { tenant_id: tenantId };
  if (active_only) where.is_active = 1;
  if (category_id) where.category_id = category_id;
  if (search) where[Op.or] = [
    { name:      { [Op.like]: `%${search}%` } },
    { reference: { [Op.like]: `%${search}%` } },
    { barcode:   { [Op.like]: `%${search}%` } },
  ];

  const { rows, count } = await Product.findAndCountAll({
    where,
    limit:    parseInt(limit),
    offset,
    order:    [['name', 'ASC']],
    distinct: true,
    include:  [
      { association: 'category', attributes: ['id', 'name'] },
      { association: 'unit',     attributes: ['id', 'name', 'abbreviation'] },
    ],
  });
  return { products: rows, total: count };
};

const getById = async (tenantId, id) => {
  const product = await Product.findOne({
    where:   { id, tenant_id: tenantId },
    include: [
      { association: 'category',    attributes: ['id', 'name'] },
      { association: 'unit',        attributes: ['id', 'name', 'abbreviation'] },
      { association: 'stockLevels', include: [{ association: 'site', attributes: ['id', 'name', 'type'] }] },
    ],
  });
  if (!product) throw new Error('Produit introuvable');
  return product;
};

const create = async (tenantId, data, imageUrl = null) => {
  if (data.reference) {
    const existing = await Product.findOne({ where: { tenant_id: tenantId, reference: data.reference } });
    if (existing) throw new Error('Cette référence est déjà utilisée');
  }
  if (data.barcode) {
    const existing = await Product.findOne({ where: { tenant_id: tenantId, barcode: data.barcode } });
    if (existing) throw new Error('Ce code-barres est déjà utilisé');
  }
  const product = await Product.create({ ...data, tenant_id: tenantId, image_url: imageUrl });

  const sites = await Site.findAll({ where: { tenant_id: tenantId, is_active: 1 } });
  if (sites.length) {
    await StockLevel.bulkCreate(
      sites.map((s) => ({ tenant_id: tenantId, product_id: product.id, site_id: s.id, quantity: 0 })),
      { ignoreDuplicates: true },
    );
  }

  return product;
};

const update = async (tenantId, id, data, imageUrl = null) => {
  const product = await Product.findOne({ where: { id, tenant_id: tenantId } });
  if (!product) throw new Error('Produit introuvable');
  if (imageUrl) data.image_url = imageUrl;
  await product.update(data);
  return getById(tenantId, id);
};

const remove = async (tenantId, id) => {
  const product = await Product.findOne({ where: { id, tenant_id: tenantId } });
  if (!product) throw new Error('Produit introuvable');
  const hasStock = await StockLevel.findOne({ where: { product_id: id, quantity: { [Op.gt]: 0 } } });
  if (hasStock) throw new Error('Impossible de supprimer un produit avec du stock disponible');
  await product.update({ del: 1 });
  return { deleted: true };
};

const getStockByProduct = async (tenantId, id) => {
  await getById(tenantId, id);
  return StockLevel.findAll({
    where:   { product_id: id },
    include: [{ association: 'site', attributes: ['id', 'name', 'type'] }],
  });
};

module.exports = { list, getById, create, update, remove, getStockByProduct };
