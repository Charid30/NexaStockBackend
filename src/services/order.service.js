// src/services/order.service.js
const { sequelize, PurchaseOrder, PurchaseOrderItem, StockLevel, StockMovement, Supplier, Site, Product } = require('../models');
const { Op } = require('sequelize');

const list = async (tenantId, { page = 1, limit = 20, status = '', supplier_id = '' }) => {
  const offset = (page - 1) * limit;
  const where  = { tenant_id: tenantId };
  if (status)      where.status      = status;
  if (supplier_id) where.supplier_id = supplier_id;
  const { rows, count } = await PurchaseOrder.findAndCountAll({
    where,
    limit:   parseInt(limit),
    offset,
    order:   [['order_date', 'DESC']],
    include: [
      { association: 'supplier', attributes: ['id', 'name'] },
      { association: 'site',     attributes: ['id', 'name'] },
      { association: 'author',   attributes: ['id', 'first_name', 'last_name'] },
    ],
  });
  return { orders: rows, total: count };
};

const getById = async (tenantId, id) => {
  const order = await PurchaseOrder.findOne({
    where:   { id, tenant_id: tenantId },
    include: [
      { association: 'supplier', attributes: ['id', 'name', 'phone', 'email'] },
      { association: 'site',     attributes: ['id', 'name'] },
      { association: 'author',   attributes: ['id', 'first_name', 'last_name'] },
      { association: 'items',    include: [{ association: 'product', attributes: ['id', 'name', 'reference'] }] },
    ],
  });
  if (!order) throw new Error('Commande introuvable');
  return order;
};

const create = async (tenantId, userId, data) => {
  const { supplier_id, site_id, reference, order_date, expected_date, note, items } = data;

  const [supplier, site] = await Promise.all([
    Supplier.findOne({ where: { id: supplier_id, tenant_id: tenantId } }),
    Site.findOne({ where: { id: site_id, tenant_id: tenantId } }),
  ]);
  if (!supplier) throw new Error('Fournisseur introuvable');
  if (!site)     throw new Error('Site introuvable');

  const existing = await PurchaseOrder.findOne({ where: { tenant_id: tenantId, reference } });
  if (existing) throw new Error('Cette référence de commande existe déjà');

  const total = items.reduce((sum, i) => sum + i.quantity_ordered * i.unit_cost, 0);

  const t = await sequelize.transaction();
  try {
    const order = await PurchaseOrder.create({
      tenant_id: tenantId, supplier_id, site_id, reference,
      order_date, expected_date: expected_date || null,
      note: note || null, total_amount: total, created_by: userId,
    }, { transaction: t });

    await PurchaseOrderItem.bulkCreate(
      items.map((i) => ({ purchase_order_id: order.id, product_id: i.product_id, quantity_ordered: i.quantity_ordered, quantity_received: 0, unit_cost: i.unit_cost })),
      { transaction: t },
    );

    await t.commit();
    return getById(tenantId, order.id);
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const receive = async (tenantId, userId, orderId, data) => {
  const { items, received_date, note } = data;
  const order = await PurchaseOrder.findOne({
    where:   { id: orderId, tenant_id: tenantId },
    include: [{ association: 'items' }],
  });
  if (!order) throw new Error('Commande introuvable');
  if (order.status === 'brouillon')    throw new Error('La commande doit être envoyée avant d\'être réceptionnée');
  if (order.status === 'annulee')      throw new Error('Commande annulée');
  if (order.status === 'recue_totale') throw new Error('Commande déjà totalement reçue');

  const t = await sequelize.transaction();
  try {
    for (const recv of items) {
      const item = order.items.find((i) => i.id === recv.id);
      if (!item) continue;
      if (recv.quantity_received <= 0) continue;

      const newReceived = parseFloat(item.quantity_received) + parseFloat(recv.quantity_received);
      await item.update({ quantity_received: newReceived }, { transaction: t });

      const [level] = await StockLevel.findOrCreate({
        where:    { product_id: item.product_id, site_id: order.site_id },
        defaults: { tenant_id: tenantId, product_id: item.product_id, site_id: order.site_id, quantity: 0 },
        transaction: t,
      });
      await level.update({ quantity: parseFloat(level.quantity) + parseFloat(recv.quantity_received) }, { transaction: t });

      await StockMovement.create({
        tenant_id: tenantId, product_id: item.product_id,
        site_id: order.site_id, type: 'entree',
        quantity: recv.quantity_received, unit_cost: item.unit_cost,
        reference: order.reference, note: note || `Réception commande ${order.reference}`,
        created_by: userId,
      }, { transaction: t });
    }

    await order.reload({ include: [{ association: 'items' }], transaction: t });
    const allReceived = order.items.every((i) => parseFloat(i.quantity_received) >= parseFloat(i.quantity_ordered));
    const anyReceived = order.items.some((i)  => parseFloat(i.quantity_received) > 0);
    const newStatus   = allReceived ? 'recue_totale' : anyReceived ? 'recue_partielle' : order.status;
    await order.update({ status: newStatus, received_date: received_date || new Date() }, { transaction: t });

    await t.commit();
    return getById(tenantId, orderId);
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

const send = async (tenantId, orderId) => {
  const order = await PurchaseOrder.findOne({ where: { id: orderId, tenant_id: tenantId } });
  if (!order) throw new Error('Commande introuvable');
  if (order.status !== 'brouillon') throw new Error('Seul un brouillon peut être envoyé');
  await order.update({ status: 'envoyee' });
  return order;
};

const cancel = async (tenantId, orderId) => {
  const order = await PurchaseOrder.findOne({ where: { id: orderId, tenant_id: tenantId } });
  if (!order) throw new Error('Commande introuvable');
  if (['recue_totale', 'annulee'].includes(order.status)) throw new Error('Impossible d\'annuler cette commande');
  await order.update({ status: 'annulee' });
  return order;
};

module.exports = { list, getById, create, send, receive, cancel };
