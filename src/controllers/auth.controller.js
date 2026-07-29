// src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const { success, error } = require('../utils/response.util');

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return success(res, result, 'Compte créé avec succès. Bienvenue sur NexaStock !', 201);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return success(res, result, 'Connexion réussie');
  } catch (err) {
    return error(res, err.message, 401);
  }
};

const refresh = async (req, res) => {
  try {
    const result = await authService.refresh(req.body);
    return success(res, result, 'Token rafraîchi');
  } catch (err) {
    return error(res, err.message, 401);
  }
};

const logout = async (req, res) => {
  try {
    const result = await authService.logout(req.body);
    return success(res, result, 'Déconnexion réussie');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await authService.getProfile(req.user.id);
    return success(res, profile, 'Profil récupéré avec succès');
  } catch (err) {
    return error(res, err.message, 404);
  }
};

const changePassword = async (req, res) => {
  try {
    const result = await authService.changePassword(req.user.id, req.body);
    return success(res, result, 'Mot de passe modifié avec succès');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

module.exports = { register, login, refresh, logout, getProfile, changePassword };
