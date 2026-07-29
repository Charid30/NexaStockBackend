const Joi = require('joi');

const saleItemSchema = Joi.object({
  product_id: Joi.string().required().messages({ 'string.empty': 'Le produit est requis' }),
  quantity:   Joi.number().positive().required().messages({ 'number.positive': 'La quantité doit être positive' }),
  unit_price: Joi.number().min(0).required().messages({ 'any.required': 'Le prix unitaire est requis' }),
});

const createSaleSchema = Joi.object({
  site_id:        Joi.string().required().messages({ 'string.empty': 'Le site est requis' }),
  payment_method: Joi.string().valid('especes', 'mobile_money', 'carte', 'cheque').required()
    .messages({ 'any.only': 'Mode de paiement invalide' }),
  note:  Joi.string().max(500).optional().allow('', null),
  items: Joi.array().items(saleItemSchema).min(1).required()
    .messages({ 'array.min': 'La vente doit contenir au moins un article' }),
});

module.exports = { createSaleSchema };
