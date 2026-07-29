// src/controllers/site.controller.js
const siteService = require('../services/site.service');
const { success, error } = require('../utils/response.util');

const list = async (req, res) => {
  try {
    const sites = await siteService.list(req.user.tenant_id);
    return success(res, sites, 'Sites récupérés');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const getById = async (req, res) => {
  try {
    const site = await siteService.getById(req.user.tenant_id, req.params.id);
    return success(res, site, 'Site récupéré');
  } catch (err) {
    return error(res, err.message, 404);
  }
};

const create = async (req, res) => {
  try {
    const site = await siteService.create(req.user.tenant_id, req.body);
    return success(res, site, 'Site créé avec succès', 201);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const update = async (req, res) => {
  try {
    const site = await siteService.update(req.user.tenant_id, req.params.id, req.body);
    return success(res, site, 'Site mis à jour');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const remove = async (req, res) => {
  try {
    const result = await siteService.remove(req.user.tenant_id, req.params.id);
    return success(res, result, 'Site supprimé');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

module.exports = { list, getById, create, update, remove };
