// src/validators/tenant.validator.js
const Joi = require('joi');

const createTenantSchema = Joi.object({
  name:        Joi.string().min(2).max(150).required().messages({ 'string.empty': 'Le nom est requis' }),
  phone:       Joi.string().pattern(/^\+?[0-9]{8,15}$/).required().messages({ 'string.empty': 'Le téléphone est requis', 'string.pattern.base': 'Numéro invalide' }),
  email:       Joi.string().email().optional().allow('', null),
  ifu_number:  Joi.string().max(50).optional().allow('', null),
  rccm_number: Joi.string().max(50).optional().allow('', null),
});

const updateTenantSchema = Joi.object({
  name:        Joi.string().min(2).max(150).optional(),
  phone:       Joi.string().pattern(/^\+?[0-9]{8,15}$/).optional(),
  email:       Joi.string().email().optional().allow('', null),
  ifu_number:  Joi.string().max(50).optional().allow('', null),
  rccm_number: Joi.string().max(50).optional().allow('', null),
  is_active:   Joi.boolean().optional(),
});

const toggleModuleSchema = Joi.object({
  module_code: Joi.string().valid('MULTI_WAREHOUSE','SUPPLIERS','ORDERS','ALERTS','REPORTS','AUDIT_LOG').required().messages({ 'any.only': 'Module invalide' }),
  is_active:   Joi.boolean().required(),
});

module.exports = { createTenantSchema, updateTenantSchema, toggleModuleSchema };
