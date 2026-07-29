// src/validators/admin.roles.validator.js
const Joi = require('joi');

const createRole = Joi.object({
  type:        Joi.string().valid('nexalab', 'tenant').required(),
  name:        Joi.string().max(50).pattern(/^[a-z_]+$/).required()
                 .messages({ 'string.pattern.base': 'Le nom ne doit contenir que des minuscules et underscores' }),
  label:       Joi.string().max(100).required(),
  description: Joi.string().optional().allow('', null),
});

const updateRole = Joi.object({
  label:       Joi.string().max(100).optional(),
  description: Joi.string().optional().allow('', null),
});

const setPermissions = Joi.object({
  permission_ids: Joi.array().items(Joi.string()).required(),
});

module.exports = { createRole, updateRole, setPermissions };
