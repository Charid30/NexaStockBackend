// src/validators/alert.validator.js
const Joi = require('joi');

const createAlertSchema = Joi.object({
  product_id:         Joi.string().required().messages({ 'string.empty': 'Le produit est requis' }),
  site_id:            Joi.string().optional().allow('', null),
  type:               Joi.string().valid('stock_bas', 'rupture').required().messages({ 'any.only': 'Type invalide (stock_bas ou rupture)' }),
  threshold_quantity: Joi.number().min(0).required().messages({ 'any.required': 'Le seuil est requis' }),
});

const updateAlertSchema = Joi.object({
  threshold_quantity: Joi.number().min(0).optional(),
  is_active:          Joi.boolean().optional(),
});

module.exports = { createAlertSchema, updateAlertSchema };
