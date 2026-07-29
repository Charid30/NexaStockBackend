// src/controllers/unit.controller.js
const unitService = require('../services/unit.service');
const { success, error } = require('../utils/response.util');

const list   = async (req, res) => { try { return success(res, await unitService.list(req.user.tenant_id), 'Unités récupérées'); } catch (err) { return error(res, err.message, 400); } };
const create = async (req, res) => { try { return success(res, await unitService.create(req.user.tenant_id, req.body), 'Unité créée', 201); } catch (err) { return error(res, err.message, 400); } };
const update = async (req, res) => { try { return success(res, await unitService.update(req.user.tenant_id, req.params.id, req.body), 'Unité mise à jour'); } catch (err) { return error(res, err.message, 400); } };
const remove = async (req, res) => { try { return success(res, await unitService.remove(req.user.tenant_id, req.params.id), 'Unité supprimée'); } catch (err) { return error(res, err.message, 400); } };

module.exports = { list, create, update, remove };
