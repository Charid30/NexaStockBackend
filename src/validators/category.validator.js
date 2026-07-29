// src/validators/category.validator.js
const Joi = require('joi');

const createCategorySchema = Joi.object({
  name:        Joi.string().min(2).max(150).required().messages({ 'string.empty': 'Le nom de la catégorie est requis' }),
  parent_id:   Joi.string().optional().allow('', null),
  description: Joi.string().max(500).optional().allow('', null),
});

const updateCategorySchema = Joi.object({
  name:        Joi.string().min(2).max(150).optional(),
  parent_id:   Joi.string().optional().allow('', null),
  description: Joi.string().max(500).optional().allow('', null),
  is_active:   Joi.boolean().optional(),
});

module.exports = { createCategorySchema, updateCategorySchema };
