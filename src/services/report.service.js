// src/services/report.service.js
const { sequelize, StockLevel, StockMovement, Product, Site, Alert, PurchaseOrder, AlertLog } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const dashboard = async (tenantId) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const todayStart    = new Date(new Date().setHours(0, 0, 0, 0));

  const [totalProducts, totalSites, movementsToday, movements30d, unreadAlerts, lowStockLevels] = await Promise.all([
    Product.count({ where: { tenant_id: tenantId, is_active: 1 } }),
    Site.count({ where: { tenant_id: tenantId, is_active: 1 } }),
    StockMovement.count({ where: { tenant_id: tenantId, created_at: { [Op.gte]: todayStart } } }),
    StockMovement.count({ where: { tenant_id: tenantId, created_at: { [Op.gte]: thirtyDaysAgo } } }),
    AlertLog.count({
      where: { is_read: 0 },
      include: [{ association: 'alert', where: { tenant_id: tenantId }, required: true, attributes: [] }],
    }),
    StockLevel.findAll({
      include: [{
        association: 'product',
        where:       { tenant_id: tenantId, is_active: 1 },
        required:    true,
        attributes:  ['id', 'name', 'reference', 'min_stock_level', 'cost_price'],
      }, {
        association: 'site',
        attributes:  ['id', 'name'],
      }],
      where: literal('`stock_levels`.`quantity` <= `product`.`min_stock_level`'),
      order: [['quantity', 'ASC']],
      limit: 10,
    }),
  ]);

  const lowStockProducts = lowStockLevels.map((l) => ({
    product_id:   l.product.id,
    product_name: l.product.name,
    site_name:    l.site?.name,
    quantity:     l.quantity,
    threshold:    l.product.min_stock_level,
  }));

  return {
    total_products:     totalProducts,
    total_sites:        totalSites,
    movements_today:    movementsToday,
    movements_30d:      movements30d,
    active_alerts:      unreadAlerts,
    low_stock_count:    lowStockLevels.length,
    low_stock_products: lowStockProducts,
  };
};

const stockValuation = async (tenantId, siteId = null) => {
  const where = {};
  const productWhere = { tenant_id: tenantId, is_active: 1 };
  if (siteId) where.site_id = siteId;

  const levels = await StockLevel.findAll({
    where,
    include: [{
      association: 'product',
      where:       productWhere,
      attributes:  ['id', 'name', 'reference', 'cost_price', 'selling_price', 'min_stock_level'],
    }, {
      association: 'site',
      attributes:  ['id', 'name'],
    }],
  });

  let totalCostValue    = 0;
  let totalSellingValue = 0;
  const lines = levels.map((l) => {
    const cost    = parseFloat(l.product.cost_price    || 0) * parseFloat(l.quantity);
    const selling = parseFloat(l.product.selling_price || 0) * parseFloat(l.quantity);
    totalCostValue    += cost;
    totalSellingValue += selling;
    return {
      product:       l.product,
      site:          l.site,
      quantity:      l.quantity,
      cost_value:    cost,
      selling_value: selling,
      is_low_stock:  parseFloat(l.quantity) <= parseFloat(l.product.min_stock_level),
    };
  });

  return { lines, total_cost_value: totalCostValue, total_selling_value: totalSellingValue };
};

const movementsSummary = async (tenantId, { date_from, date_to, site_id }) => {
  const where = { tenant_id: tenantId };
  if (site_id)  where.site_id    = site_id;
  if (date_from || date_to) {
    where.created_at = {};
    if (date_from) where.created_at[Op.gte] = new Date(date_from);
    if (date_to)   where.created_at[Op.lte] = new Date(date_to);
  }

  const movements = await StockMovement.findAll({
    where,
    attributes: ['type', [fn('COUNT', col('id')), 'count'], [fn('SUM', col('quantity')), 'total_quantity']],
    group:      ['type'],
  });
  return movements;
};

const lowStockProducts = async (tenantId) => {
  const levels = await StockLevel.findAll({
    include: [{
      association: 'product',
      where:       { tenant_id: tenantId, is_active: 1 },
      required:    true,
      attributes:  ['id', 'name', 'reference', 'min_stock_level'],
    }, {
      association: 'site',
      attributes:  ['id', 'name'],
    }],
    where: literal('`stock_levels`.`quantity` <= `product`.`min_stock_level`'),
    order: [['quantity', 'ASC']],
  });
  return levels;
};

module.exports = { dashboard, stockValuation, movementsSummary, lowStockProducts };
