// src/validators/supplier.validator.js
const Joi = require('joi');

const createSupplierSchema = Joi.object({
  name:           Joi.string().min(2).max(150).required().messages({ 'string.empty': 'Le nom du fournisseur est requis' }),
  email:          Joi.string().email().optional().allow('', null),
  phone:          Joi.string().pattern(/^\+?[0-9]{8,15}$/).optional().allow('', null),
  address:        Joi.string().max(300).optional().allow('', null),
  contact_person: Joi.string().max(150).optional().allow('', null),
  ifu_number:     Joi.string().max(50).optional().allow('', null),
});

const updateSupplierSchema = createSupplierSchema.append({
  is_active: Joi.boolean().optional(),
}).fork(['name'], (s) => s.optional());

module.exports = { createSupplierSchema, updateSupplierSchema };
