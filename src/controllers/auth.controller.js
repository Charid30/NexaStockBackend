// src/controllers/auth.controller.js
const authService = require('../services/auth.service');
const { success, error } = require('../utils/response.util');
const { getUserPermissions } = require('../middlewares/permission.middleware');

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

const getPermissions = async (req, res) => {
  try {
    const { role } = req.user;
    const permSet = await getUserPermissions(role);
    const data = [...permSet].map((k) => {
      const [module, action] = k.split('.');
      return { module, action };
    });
    return success(res, data, 'Permissions chargées');
  } catch (err) {
    return error(res, 'Erreur lors du chargement des permissions', 500);
  }
};

module.exports = { register, login, refresh, logout, getProfile, changePassword, getPermissions };
