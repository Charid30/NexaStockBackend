// src/validators/company.validator.js
const Joi = require('joi');

const updateCompanySchema = Joi.object({
  name:        Joi.string().min(2).max(150).optional().messages({ 'string.empty': 'Le nom est requis' }),
  phone:       Joi.string().pattern(/^\+?[0-9]{8,15}$/).optional().messages({ 'string.pattern.base': 'Numéro invalide' }),
  email:       Joi.string().email().optional().allow('', null),
  ifu_number:  Joi.string().max(50).optional().allow('', null),
  rccm_number: Joi.string().max(50).optional().allow('', null),
});

module.exports = { updateCompanySchema };
