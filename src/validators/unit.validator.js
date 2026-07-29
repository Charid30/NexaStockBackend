// src/validators/unit.validator.js
const Joi = require('joi');

const createUnitSchema = Joi.object({
  name:         Joi.string().min(1).max(80).required().messages({ 'string.empty': 'Le nom de l\'unité est requis' }),
  abbreviation: Joi.string().min(1).max(10).required().messages({ 'string.empty': 'L\'abréviation est requise' }),
});

const updateUnitSchema = Joi.object({
  name:         Joi.string().min(1).max(80).optional(),
  abbreviation: Joi.string().min(1).max(10).optional(),
  is_active:    Joi.boolean().optional(),
});

module.exports = { createUnitSchema, updateUnitSchema };
