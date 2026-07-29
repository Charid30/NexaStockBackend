// src/controllers/category.controller.js
const categoryService = require('../services/category.service');
const { success, error } = require('../utils/response.util');

const list    = async (req, res) => { try { return success(res, await categoryService.list(req.user.tenant_id), 'Catégories récupérées'); } catch (err) { return error(res, err.message, 400); } };
const getById = async (req, res) => { try { return success(res, await categoryService.getById(req.user.tenant_id, req.params.id), 'Catégorie récupérée'); } catch (err) { return error(res, err.message, 404); } };
const create  = async (req, res) => { try { return success(res, await categoryService.create(req.user.tenant_id, req.body), 'Catégorie créée', 201); } catch (err) { return error(res, err.message, 400); } };
const update  = async (req, res) => { try { return success(res, await categoryService.update(req.user.tenant_id, req.params.id, req.body), 'Catégorie mise à jour'); } catch (err) { return error(res, err.message, 400); } };
const remove  = async (req, res) => { try { return success(res, await categoryService.remove(req.user.tenant_id, req.params.id), 'Catégorie supprimée'); } catch (err) { return error(res, err.message, 400); } };

module.exports = { list, getById, create, update, remove };
