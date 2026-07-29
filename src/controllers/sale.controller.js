const saleService    = require('../services/sale.service');
const { success, error } = require('../utils/response.util');

const create = async (req, res) => {
  try {
    const sale = await saleService.create(req.user.tenant_id, req.user.id, req.body);
    return success(res, sale, 'Vente enregistrée', 201);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const list = async (req, res) => {
  try {
    const filters = { ...req.query };
    if (req.user.role === 'caissier') filters.user_id = req.user.id;
    const result = await saleService.list(req.user.tenant_id, filters);
    return success(res, result);
  } catch (err) {
    return error(res, err.message, 500);
  }
};

const getById = async (req, res) => {
  try {
    const sale = await saleService.getById(req.user.tenant_id, req.params.id);
    return success(res, sale);
  } catch (err) {
    return error(res, err.message, 404);
  }
};

module.exports = { create, list, getById };
