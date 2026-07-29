// src/validators/product.validator.js
const Joi = require('joi');

const createProductSchema = Joi.object({
  name:            Joi.string().min(2).max(200).required().messages({ 'string.empty': 'Le nom du produit est requis' }),
  category_id:     Joi.string().optional().allow('', null),
  unit_id:         Joi.string().optional().allow('', null),
  reference:       Joi.string().max(100).optional().allow('', null),
  barcode:         Joi.string().max(100).optional().allow('', null),
  description:     Joi.string().max(1000).optional().allow('', null),
  selling_price:   Joi.number().min(0).optional().allow(null),
  cost_price:      Joi.number().min(0).optional().allow(null),
  min_stock_level: Joi.number().min(0).default(0),
});

const updateProductSchema = Joi.object({
  name:            Joi.string().min(2).max(200).optional(),
  category_id:     Joi.string().optional().allow('', null),
  unit_id:         Joi.string().optional().allow('', null),
  reference:       Joi.string().max(100).optional().allow('', null),
  barcode:         Joi.string().max(100).optional().allow('', null),
  description:     Joi.string().max(1000).optional().allow('', null),
  selling_price:   Joi.number().min(0).optional().allow(null),
  cost_price:      Joi.number().min(0).optional().allow(null),
  min_stock_level: Joi.number().min(0).optional(),
  is_active:       Joi.boolean().optional(),
});

module.exports = { createProductSchema, updateProductSchema };
