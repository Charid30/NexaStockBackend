const { sequelize, Sale, SaleItem, Product, Site, StockLevel, StockMovement, Alert, AlertLog } = require('../models');
const { Op } = require('sequelize');

const _generateRef = () => {
  const now = new Date();
  const pad  = (n) => String(n).padStart(2, '0');
  const date = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const time = `${pad(now.getHours())}${pad(now.getMinutes())}`;
  return `VTE-${date}-${time}`;
};

const _checkAlerts = async (tenantId, productId, siteId, quantity) => {
  const alerts = await Alert.findAll({
    where: {
      tenant_id:  tenantId,
      product_id: productId,
      is_active:  1,
      site_id:    { [Op.or]: [siteId, null] },
    },
  });
  for (const alert of alerts) {
    if (quantity <= alert.threshold_quantity) {
      await AlertLog.create({
        alert_id:         alert.id,
        product_id:       productId,
        site_id:          siteId,
        current_quantity: quantity,
      });
    }
  }
};

const create = async (tenantId, userId, data) => {
  const { site_id, items, payment_method, note } = data;

  const site = await Site.findOne({ where: { id: site_id, tenant_id: tenantId, is_active: 1 } });
  if (!site) throw new Error('Site introuvable ou inactif');

  const t = await sequelize.transaction();
  try {
    let total_amount = 0;
    const stockUpdates = [];

    for (const item of items) {
      const product = await Product.findOne({ where: { id: item.product_id, tenant_id: tenantId }, transaction: t });
      if (!product) throw new Error(`Produit introuvable`);

      const level = await StockLevel.findOne({ where: { product_id: item.product_id, site_id }, transaction: t });
      if (!level || parseFloat(level.quantity) < parseFloat(item.quantity)) {
        throw new Error(`Stock insuffisant pour "${product.name}". Disponible : ${level ? level.quantity : 0}`);
      }

      const subtotal = parseFloat(item.quantity) * parseFloat(item.unit_price);
      total_amount += subtotal;
      stockUpdates.push({ level, product, qty: parseFloat(item.quantity), subtotal, item });
    }

    const sale = await Sale.create({
      tenant_id: tenantId,
      site_id,
      user_id:        userId,
      reference:      _generateRef(),
      total_amount:   total_amount.toFixed(2),
      payment_method,
      note:           note || null,
    }, { transaction: t });

    for (const { level, product, qty, subtotal, item } of stockUpdates) {
      await SaleItem.create({
        sale_id:    sale.id,
        product_id: item.product_id,
        quantity:   item.quantity,
        unit_price: item.unit_price,
        subtotal,
      }, { transaction: t });

      const newQty = parseFloat(level.quantity) - qty;
      await level.update({ quantity: newQty }, { transaction: t });

      await StockMovement.create({
        tenant_id:  tenantId,
        product_id: item.product_id,
        site_id,
        type:       'sortie',
        quantity:   item.quantity,
        reference:  sale.reference,
        note:       `Vente ${sale.reference}`,
        created_by: userId,
      }, { transaction: t });
    }

    await t.commit();

    for (const { level, item, qty } of stockUpdates) {
      await _checkAlerts(tenantId, item.product_id, site_id, parseFloat(level.quantity) - qty);
    }

    return getById(tenantId, sale.id);
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const list = async (tenantId, { page = 1, limit = 20, site_id, user_id, date_from, date_to } = {}) => {
  const offset = (page - 1) * limit;
  const where  = { tenant_id: tenantId };
  if (site_id)              where.site_id  = site_id;
  if (user_id)              where.user_id  = user_id;
  if (date_from || date_to) {
    where.created_at = {};
    if (date_from) where.created_at[Op.gte] = new Date(date_from);
    if (date_to)   where.created_at[Op.lte] = new Date(date_to);
  }

  const { rows, count } = await Sale.findAndCountAll({
    where,
    limit:   parseInt(limit),
    offset,
    order:   [['created_at', 'DESC']],
    include: [
      { association: 'site',     attributes: ['id', 'name'] },
      { association: 'cashier',  attributes: ['id', 'first_name', 'last_name'] },
      { association: 'items', include: [{ association: 'product', attributes: ['id', 'name', 'reference'] }] },
    ],
  });
  return { sales: rows, total: count };
};

const getById = async (tenantId, saleId) => {
  const sale = await Sale.findOne({
    where:   { id: saleId, tenant_id: tenantId },
    include: [
      { association: 'site',    attributes: ['id', 'name'] },
      { association: 'cashier', attributes: ['id', 'first_name', 'last_name'] },
      {
        association: 'items',
        include: [{
          association: 'product',
          attributes:  ['id', 'name', 'reference'],
          include:     [{ association: 'unit', attributes: ['id', 'abbreviation'] }],
        }],
      },
    ],
  });
  if (!sale) throw new Error('Vente introuvable');
  return sale;
};

module.exports = { create, list, getById };
