// src/controllers/admin.agent.controller.js
const svc            = require('../services/admin.agent.service');
const { success, error } = require('../utils/response.util');

const list = async (req, res) => {
  try {
    const result = await svc.list(req.query);
    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
};

const create = async (req, res) => {
  try {
    const agent = await svc.create(req.body);
    return success(res, agent, 'Agent créé avec succès', 201);
  } catch (err) {
    return error(res, err.message);
  }
};

const update = async (req, res) => {
  try {
    const agent = await svc.update(req.params.id, req.body);
    return success(res, agent, 'Agent mis à jour');
  } catch (err) {
    return error(res, err.message);
  }
};

const toggleStatus = async (req, res) => {
  try {
    const agent = await svc.toggleStatus(req.params.id);
    return success(res, agent, 'Statut modifié');
  } catch (err) {
    return error(res, err.message);
  }
};

const remove = async (req, res) => {
  try {
    const result = await svc.remove(req.params.id);
    return success(res, result, 'Agent supprimé');
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { list, create, update, toggleStatus, remove };
