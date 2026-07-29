// src/controllers/stock.controller.js
const stockService = require('../services/stock.service');
const { success, error, paginate } = require('../utils/response.util');

const listLevels = async (req, res) => {
  try {
    const { site_id = '', product_id = '' } = req.query;
    const levels = await stockService.listLevels(req.user.tenant_id, { site_id, product_id });
    return success(res, levels, 'Niveaux de stock récupérés');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const entree = async (req, res) => {
  try {
    const result = await stockService.entree(req.user.tenant_id, req.user.id, req.body);
    return success(res, result, 'Entrée de stock enregistrée', 201);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const sortie = async (req, res) => {
  try {
    const result = await stockService.sortie(req.user.tenant_id, req.user.id, req.body);
    return success(res, result, 'Sortie de stock enregistrée', 201);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const transfert = async (req, res) => {
  try {
    const result = await stockService.transfert(req.user.tenant_id, req.user.id, req.body);
    return success(res, result, 'Transfert effectué avec succès', 201);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const ajustement = async (req, res) => {
  try {
    const result = await stockService.ajustement(req.user.tenant_id, req.user.id, req.body);
    return success(res, result, 'Ajustement effectué avec succès', 201);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const listMovements = async (req, res) => {
  try {
    const { page = 1, limit = 20, ...filters } = req.query;
    const { movements, total } = await stockService.listMovements(req.user.tenant_id, { page, limit, ...filters });
    return paginate(res, movements, page, limit, total, 'Mouvements récupérés');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

module.exports = { listLevels, entree, sortie, transfert, ajustement, listMovements };
