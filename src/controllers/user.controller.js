// src/controllers/user.controller.js
const userService = require('../services/user.service');
const { success, error, paginate } = require('../utils/response.util');

const list = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', role = '' } = req.query;
    const { users, total } = await userService.list(req.user.tenant_id, { page, limit, search, role });
    return paginate(res, users, page, limit, total, 'Utilisateurs récupérés');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const getById = async (req, res) => {
  try {
    const user = await userService.getById(req.user.tenant_id, req.params.id);
    return success(res, user, 'Utilisateur récupéré');
  } catch (err) {
    return error(res, err.message, 404);
  }
};

const create = async (req, res) => {
  try {
    const user = await userService.create(req.user.tenant_id, req.body);
    return success(res, user, 'Utilisateur créé avec succès', 201);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const update = async (req, res) => {
  try {
    const user = await userService.update(req.user.tenant_id, req.params.id, req.body);
    return success(res, user, 'Utilisateur mis à jour');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const assignSites = async (req, res) => {
  try {
    const user = await userService.assignSites(req.user.tenant_id, req.params.id, req.body);
    return success(res, user, 'Sites mis à jour');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const remove = async (req, res) => {
  try {
    const result = await userService.remove(req.user.tenant_id, req.params.id, req.user.id);
    return success(res, result, 'Utilisateur supprimé');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await require('../services/auth.service').getProfile(req.user.id);
    return success(res, user, 'Profil récupéré');
  } catch (err) {
    return error(res, err.message, 404);
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);
    return success(res, user, 'Profil mis à jour');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

module.exports = { list, getById, create, update, assignSites, remove, getProfile, updateProfile };
