// src/validators/site.validator.js
const Joi = require('joi');

const createSiteSchema = Joi.object({
  name:    Joi.string().min(2).max(150).required().messages({ 'string.empty': 'Le nom du site est requis' }),
  type:    Joi.string().valid('siege', 'annexe', 'entrepot', 'boutique').default('boutique'),
  address: Joi.string().max(300).optional().allow('', null),
  phone:   Joi.string().pattern(/^\+?[0-9]{8,15}$/).optional().allow('', null),
  email:   Joi.string().email().optional().allow('', null),
});

const updateSiteSchema = Joi.object({
  name:      Joi.string().min(2).max(150).optional(),
  type:      Joi.string().valid('siege', 'annexe', 'entrepot', 'boutique').optional(),
  address:   Joi.string().max(300).optional().allow('', null),
  phone:     Joi.string().pattern(/^\+?[0-9]{8,15}$/).optional().allow('', null),
  email:     Joi.string().email().optional().allow('', null),
  is_active: Joi.boolean().optional(),
});

module.exports = { createSiteSchema, updateSiteSchema };
