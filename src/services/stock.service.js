// src/services/stock.service.js
const { sequelize, StockLevel, StockMovement, Product, Site, Alert, AlertLog } = require('../models');
const { Op } = require('sequelize');

const _getOrCreateLevel = async (tenantId, productId, siteId, t) => {
  const [level] = await StockLevel.findOrCreate({
    where:    { product_id: productId, site_id: siteId },
    defaults: { tenant_id: tenantId, product_id: productId, site_id: siteId, quantity: 0 },
    transaction: t,
  });
  return level;
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

const entree = async (tenantId, userId, data) => {
  const { product_id, site_id, quantity, unit_cost, reference, note } = data;

  await _validateProductSite(tenantId, product_id, site_id);

  const t = await sequelize.transaction();
  try {
    const level = await _getOrCreateLevel(tenantId, product_id, site_id, t);
    const newQty = parseFloat(level.quantity) + parseFloat(quantity);
    await level.update({ quantity: newQty }, { transaction: t });

    const movement = await StockMovement.create({
      tenant_id: tenantId, product_id, site_id, type: 'entree',
      quantity, unit_cost: unit_cost || null, reference: reference || null,
      note: note || null, created_by: userId,
    }, { transaction: t });

    await t.commit();
    await _checkAlerts(tenantId, product_id, site_id, newQty);
    return { movement, new_quantity: newQty };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const sortie = async (tenantId, userId, data) => {
  const { product_id, site_id, quantity, reference, note } = data;

  await _validateProductSite(tenantId, product_id, site_id);

  const t = await sequelize.transaction();
  try {
    const level = await _getOrCreateLevel(tenantId, product_id, site_id, t);
    if (parseFloat(level.quantity) < parseFloat(quantity)) {
      throw new Error(`Stock insuffisant. Disponible : ${level.quantity}`);
    }

    const newQty = parseFloat(level.quantity) - parseFloat(quantity);
    await level.update({ quantity: newQty }, { transaction: t });

    const movement = await StockMovement.create({
      tenant_id: tenantId, product_id, site_id, type: 'sortie',
      quantity, reference: reference || null, note: note || null, created_by: userId,
    }, { transaction: t });

    await t.commit();
    await _checkAlerts(tenantId, product_id, site_id, newQty);
    return { movement, new_quantity: newQty };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const transfert = async (tenantId, userId, data) => {
  const { product_id, source_site_id, destination_site_id, quantity, note } = data;

  if (source_site_id === destination_site_id) throw new Error('Le site source et le site destination doivent être différents');
  await _validateProductSite(tenantId, product_id, source_site_id);
  await _validateSite(tenantId, destination_site_id);

  const t = await sequelize.transaction();
  try {
    const sourceLevel = await _getOrCreateLevel(tenantId, product_id, source_site_id, t);
    if (parseFloat(sourceLevel.quantity) < parseFloat(quantity)) {
      throw new Error(`Stock insuffisant sur le site source. Disponible : ${sourceLevel.quantity}`);
    }

    const destLevel = await _getOrCreateLevel(tenantId, product_id, destination_site_id, t);

    const newSourceQty = parseFloat(sourceLevel.quantity) - parseFloat(quantity);
    const newDestQty   = parseFloat(destLevel.quantity)   + parseFloat(quantity);

    await sourceLevel.update({ quantity: newSourceQty }, { transaction: t });
    await destLevel.update(  { quantity: newDestQty   }, { transaction: t });

    const movement = await StockMovement.create({
      tenant_id: tenantId, product_id,
      site_id: source_site_id, destination_site_id,
      type: 'transfert', quantity,
      note: note || null, created_by: userId,
    }, { transaction: t });

    await t.commit();
    await _checkAlerts(tenantId, product_id, source_site_id, newSourceQty);
    return { movement, source_quantity: newSourceQty, destination_quantity: newDestQty };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const ajustement = async (tenantId, userId, data) => {
  const { product_id, site_id, nouvelle_quantite, note } = data;

  await _validateProductSite(tenantId, product_id, site_id);

  const t = await sequelize.transaction();
  try {
    const level       = await _getOrCreateLevel(tenantId, product_id, site_id, t);
    const ancien      = parseFloat(level.quantity);
    const diff        = parseFloat(nouvelle_quantite) - ancien;
    const type_diff   = diff >= 0 ? 'entree' : 'sortie';

    await level.update({ quantity: nouvelle_quantite }, { transaction: t });

    const movement = await StockMovement.create({
      tenant_id: tenantId, product_id, site_id, type: 'ajustement',
      quantity:  Math.abs(diff),
      note:      note || `Ajustement : ${ancien} → ${nouvelle_quantite}`,
      created_by: userId,
    }, { transaction: t });

    await t.commit();
    await _checkAlerts(tenantId, product_id, site_id, nouvelle_quantite);
    return { movement, old_quantity: ancien, new_quantity: nouvelle_quantite };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const listLevels = async (tenantId, { site_id = '', product_id = '' } = {}) => {
  const where = { tenant_id: tenantId };
  if (site_id)    where.site_id    = site_id;
  if (product_id) where.product_id = product_id;

  return StockLevel.findAll({
    where,
    order: [['updated_at', 'DESC']],
    include: [
      {
        association: 'product',
        attributes: ['id', 'name', 'reference', 'cost_price', 'selling_price'],
        include: [{ association: 'unit', attributes: ['id', 'name', 'abbreviation'] }],
      },
      { association: 'site', attributes: ['id', 'name', 'type'] },
    ],
  });
};

const listMovements = async (tenantId, filters) => {
  const { page = 1, limit = 20, product_id, site_id, type, date_from, date_to } = filters;
  const offset = (page - 1) * limit;
  const where  = { tenant_id: tenantId };

  if (product_id) where.product_id = product_id;
  if (site_id)    where.site_id    = site_id;
  if (type)       where.type       = type;
  if (date_from || date_to) {
    where.created_at = {};
    if (date_from) where.created_at[Op.gte] = new Date(date_from);
    if (date_to)   where.created_at[Op.lte] = new Date(date_to);
  }

  const { rows, count } = await StockMovement.findAndCountAll({
    where,
    limit:   parseInt(limit),
    offset,
    order:   [['created_at', 'DESC']],
    include: [
      { association: 'product',         attributes: ['id', 'name', 'reference'] },
      { association: 'sourceSite',      attributes: ['id', 'name'] },
      { association: 'destinationSite', attributes: ['id', 'name'] },
      { association: 'author',          attributes: ['id', 'first_name', 'last_name'] },
    ],
  });
  return { movements: rows, total: count };
};

// ─── Helpers privés ───────────────────────────────────────────────────────────

const _validateProductSite = async (tenantId, productId, siteId) => {
  const product = await Product.findOne({ where: { id: productId, tenant_id: tenantId } });
  if (!product) throw new Error('Produit introuvable');
  await _validateSite(tenantId, siteId);
};

const _validateSite = async (tenantId, siteId) => {
  const site = await Site.findOne({ where: { id: siteId, tenant_id: tenantId, is_active: 1 } });
  if (!site) throw new Error('Site introuvable ou inactif');
};

module.exports = { listLevels, entree, sortie, transfert, ajustement, listMovements };
