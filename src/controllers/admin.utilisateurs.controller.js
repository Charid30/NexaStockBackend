// src/controllers/admin.utilisateurs.controller.js
const svc                = require('../services/admin.utilisateurs.service');
const { success, error } = require('../utils/response.util');

const list = async (req, res) => {
  try {
    const result = await svc.list(req.query);
    return success(res, result);
  } catch (err) {
    return error(res, err.message);
  }
};

const toggleStatus = async (req, res) => {
  try {
    const user = await svc.toggleStatus(req.params.id);
    return success(res, user, 'Statut modifié');
  } catch (err) {
    return error(res, err.message);
  }
};

module.exports = { list, toggleStatus };
