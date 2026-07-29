// src/validators/auth.validator.js
const Joi = require('joi');

const registerSchema = Joi.object({
  // Informations de l'entreprise
  company_name: Joi.string().min(2).max(150).required().messages({
    'string.empty': 'Le nom de l\'entreprise est requis',
    'string.min':   'Le nom de l\'entreprise doit contenir au moins 2 caractères',
  }),
  company_phone: Joi.string().pattern(/^\+?[0-9]{8,15}$/).required().messages({
    'string.empty':        'Le numéro de téléphone de l\'entreprise est requis',
    'string.pattern.base': 'Le numéro de téléphone est invalide',
  }),
  company_email: Joi.string().email().optional().allow('', null).messages({
    'string.email': 'L\'adresse email de l\'entreprise est invalide',
  }),
  company_ifu:  Joi.string().max(50).optional().allow('', null),
  company_rccm: Joi.string().max(50).optional().allow('', null),

  // Informations personnelles du propriétaire
  first_name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Le prénom est requis',
    'string.min':   'Le prénom doit contenir au moins 2 caractères',
  }),
  last_name: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'Le nom est requis',
  }),
  phone: Joi.string().pattern(/^\+?[0-9]{8,15}$/).required().messages({
    'string.empty':        'Votre numéro de téléphone est requis',
    'string.pattern.base': 'Le numéro de téléphone est invalide',
  }),
  email: Joi.string().email().optional().allow('', null).messages({
    'string.email': 'L\'adresse email est invalide',
  }),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).required().messages({
    'string.empty':        'Le mot de passe est requis',
    'string.min':          'Le mot de passe doit contenir au moins 8 caractères',
    'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
  }),
});

const loginSchema = Joi.object({
  phone:    Joi.string().required().messages({ 'string.empty': 'Le numéro de téléphone est requis' }),
  password: Joi.string().required().messages({ 'string.empty': 'Le mot de passe est requis' }),
});

const refreshSchema = Joi.object({
  refresh_token: Joi.string().required().messages({ 'string.empty': 'Le refresh token est requis' }),
});

const changePasswordSchema = Joi.object({
  current_password: Joi.string().required().messages({
    'string.empty': 'Le mot de passe actuel est requis',
  }),
  new_password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/).required().messages({
    'string.empty':        'Le nouveau mot de passe est requis',
    'string.min':          'Le mot de passe doit contenir au moins 8 caractères',
    'string.pattern.base': 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
  }),
});

module.exports = { registerSchema, loginSchema, refreshSchema, changePasswordSchema };
