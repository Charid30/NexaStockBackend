// src/controllers/tenant.controller.js
const tenantService = require('../services/tenant.service');
const { success, error, paginate } = require('../utils/response.util');

const list = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '' } = req.query;
    const { tenants, total } = await tenantService.list({ page, limit, search });
    return paginate(res, tenants, page, limit, total, 'Organisations récupérées');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const getById = async (req, res) => {
  try {
    const tenant = await tenantService.getById(req.params.id);
    return success(res, tenant, 'Organisation récupérée');
  } catch (err) {
    return error(res, err.message, 404);
  }
};

const update = async (req, res) => {
  try {
    const tenant = await tenantService.update(req.params.id, req.body);
    return success(res, tenant, 'Organisation mise à jour');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const toggleModule = async (req, res) => {
  try {
    const mod = await tenantService.toggleModule(req.params.id, req.body);
    return success(res, mod, 'Module mis à jour');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const getStats = async (req, res) => {
  try {
    const stats = await tenantService.getStats();
    return success(res, stats, 'Statistiques récupérées');
  } catch (err) {
    return error(res, err.message, 500);
  }
};

module.exports = { list, getById, update, toggleModule, getStats };
