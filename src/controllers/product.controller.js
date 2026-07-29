// src/controllers/product.controller.js
const productService = require('../services/product.service');
const { success, error, paginate } = require('../utils/response.util');

const list = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = '', category_id = '', active_only = 'true' } = req.query;
    const { products, total } = await productService.list(req.user.tenant_id, { page, limit, search, category_id, active_only: active_only === 'true' });
    return paginate(res, products, page, limit, total, 'Produits récupérés');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const getById = async (req, res) => {
  try {
    return success(res, await productService.getById(req.user.tenant_id, req.params.id), 'Produit récupéré');
  } catch (err) {
    return error(res, err.message, 404);
  }
};

const create = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;
    const product  = await productService.create(req.user.tenant_id, req.body, imageUrl);
    return success(res, product, 'Produit créé avec succès', 201);
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const update = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/products/${req.file.filename}` : null;
    const product  = await productService.update(req.user.tenant_id, req.params.id, req.body, imageUrl);
    return success(res, product, 'Produit mis à jour');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const remove = async (req, res) => {
  try {
    return success(res, await productService.remove(req.user.tenant_id, req.params.id), 'Produit supprimé');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const getStock = async (req, res) => {
  try {
    return success(res, await productService.getStockByProduct(req.user.tenant_id, req.params.id), 'Stock récupéré');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

module.exports = { list, getById, create, update, remove, getStock };
