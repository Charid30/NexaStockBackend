// src/validators/stock.validator.js
const Joi = require('joi');

const entreeSchema = Joi.object({
  product_id: Joi.string().required().messages({ 'string.empty': 'Le produit est requis' }),
  site_id:    Joi.string().required().messages({ 'string.empty': 'Le site est requis' }),
  quantity:   Joi.number().positive().required().messages({ 'number.positive': 'La quantité doit être positive', 'any.required': 'La quantité est requise' }),
  unit_cost:  Joi.number().min(0).optional().allow(null),
  reference:  Joi.string().max(100).optional().allow('', null),
  note:       Joi.string().max(500).optional().allow('', null),
});

const sortieSchema = Joi.object({
  product_id: Joi.string().required().messages({ 'string.empty': 'Le produit est requis' }),
  site_id:    Joi.string().required().messages({ 'string.empty': 'Le site est requis' }),
  quantity:   Joi.number().positive().required().messages({ 'number.positive': 'La quantité doit être positive' }),
  reference:  Joi.string().max(100).optional().allow('', null),
  note:       Joi.string().max(500).optional().allow('', null),
});

const transfertSchema = Joi.object({
  product_id:          Joi.string().required().messages({ 'string.empty': 'Le produit est requis' }),
  source_site_id:      Joi.string().required().messages({ 'string.empty': 'Le site source est requis' }),
  destination_site_id: Joi.string().required().messages({ 'string.empty': 'Le site destination est requis' }),
  quantity:            Joi.number().positive().required().messages({ 'number.positive': 'La quantité doit être positive' }),
  note:                Joi.string().max(500).optional().allow('', null),
});

const ajustementSchema = Joi.object({
  product_id:        Joi.string().required(),
  site_id:           Joi.string().required(),
  nouvelle_quantite: Joi.number().min(0).required().messages({ 'any.required': 'La nouvelle quantité est requise' }),
  note:              Joi.string().max(500).optional().allow('', null),
});

const listMovementsSchema = Joi.object({
  page:       Joi.number().integer().min(1).default(1),
  limit:      Joi.number().integer().min(1).max(100).default(20),
  product_id: Joi.string().optional(),
  site_id:    Joi.string().optional(),
  type:       Joi.string().valid('entree', 'sortie', 'transfert', 'ajustement').optional(),
  date_from:  Joi.date().iso().optional(),
  date_to:    Joi.date().iso().optional(),
});

module.exports = { entreeSchema, sortieSchema, transfertSchema, ajustementSchema, listMovementsSchema };
