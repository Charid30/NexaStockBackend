// src/validators/user.validator.js
const Joi = require('joi');

const createUserSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).required().messages({ 'string.empty': 'Le prénom est requis' }),
  last_name:  Joi.string().min(2).max(100).required().messages({ 'string.empty': 'Le nom est requis' }),
  phone:      Joi.string().pattern(/^\+?[0-9]{8,15}$/).required().messages({ 'string.empty': 'Le numéro est requis', 'string.pattern.base': 'Numéro invalide' }),
  email:      Joi.string().email().optional().allow('', null),
  role:       Joi.string().valid('manager', 'caissier', 'magasinier', 'auditeur', 'livreur').required().messages({ 'any.only': 'Rôle invalide', 'string.empty': 'Le rôle est requis' }),
  site_ids:   Joi.array().items(Joi.string().uuid()).optional().default([]),
  password:   Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).required().messages({
    'string.empty':        'Le mot de passe est requis',
    'string.min':          'Minimum 8 caractères',
    'string.pattern.base': 'Le mot de passe doit contenir majuscule, minuscule et chiffre',
  }),
});

const updateUserSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).optional(),
  last_name:  Joi.string().min(2).max(100).optional(),
  phone:      Joi.string().pattern(/^\+?[0-9]{8,15}$/).optional().messages({ 'string.pattern.base': 'Numéro de téléphone invalide' }),
  email:      Joi.string().email().optional().allow('', null),
  role:       Joi.string().valid('manager', 'caissier', 'magasinier', 'auditeur', 'livreur').optional(),
  is_active:  Joi.boolean().optional(),
  site_ids:   Joi.array().items(Joi.string().uuid()).optional(),
  password:   Joi.string().min(8).optional().allow(''),
});

const assignSitesSchema = Joi.object({
  site_ids: Joi.array().items(Joi.string()).min(0).required(),
});

const updateProfileSchema = Joi.object({
  first_name: Joi.string().min(2).max(100).optional(),
  last_name:  Joi.string().min(2).max(100).optional(),
  email:      Joi.string().email().optional().allow('', null),
});

module.exports = { createUserSchema, updateUserSchema, assignSitesSchema, updateProfileSchema };
