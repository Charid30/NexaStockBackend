// src/validators/admin.agent.validator.js
const Joi = require('joi');

const NEXALAB_ROLES = ['nexalab_support', 'nexalab_commercial', 'nexalab_technique'];

const create = Joi.object({
  first_name: Joi.string().max(100).required(),
  last_name:  Joi.string().max(100).required(),
  phone:      Joi.string().max(20).required(),
  email:      Joi.string().email().max(150).optional().allow('', null),
  password:   Joi.string().min(6).required(),
  role:       Joi.string().valid(...NEXALAB_ROLES).required(),
});

const update = Joi.object({
  first_name: Joi.string().max(100).optional(),
  last_name:  Joi.string().max(100).optional(),
  phone:      Joi.string().max(20).optional(),
  email:      Joi.string().email().max(150).optional().allow('', null),
  password:   Joi.string().min(6).optional().allow('', null),
  role:       Joi.string().valid(...NEXALAB_ROLES).optional(),
  is_active:  Joi.number().valid(0, 1).optional(),
});

module.exports = { create, update };
