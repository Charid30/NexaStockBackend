// src/validators/order.validator.js
const Joi = require('joi');

const orderItemSchema = Joi.object({
  product_id:       Joi.string().required().messages({ 'string.empty': 'Le produit est requis' }),
  quantity_ordered: Joi.number().positive().required().messages({ 'number.positive': 'La quantité doit être positive' }),
  unit_cost:        Joi.number().min(0).required().messages({ 'any.required': 'Le coût unitaire est requis' }),
});

const createOrderSchema = Joi.object({
  supplier_id:   Joi.string().required().messages({ 'string.empty': 'Le fournisseur est requis' }),
  site_id:       Joi.string().required().messages({ 'string.empty': 'Le site destinataire est requis' }),
  reference:     Joi.string().max(100).required().messages({ 'string.empty': 'La référence est requise' }),
  order_date:    Joi.date().iso().required().messages({ 'any.required': 'La date de commande est requise' }),
  expected_date: Joi.date().iso().optional().allow(null),
  note:          Joi.string().max(1000).optional().allow('', null),
  items:         Joi.array().items(orderItemSchema).min(1).required().messages({ 'array.min': 'La commande doit contenir au moins un article' }),
});

const receiveOrderSchema = Joi.object({
  items: Joi.array().items(Joi.object({
    id:                Joi.number().integer().required(),
    quantity_received: Joi.number().min(0).required(),
  })).min(1).required(),
  received_date: Joi.date().iso().optional(),
  note:          Joi.string().max(500).optional().allow('', null),
});

module.exports = { createOrderSchema, receiveOrderSchema };
