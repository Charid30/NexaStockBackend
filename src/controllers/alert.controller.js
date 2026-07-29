// src/controllers/alert.controller.js
const alertService = require('../services/alert.service');
const { success, error, paginate } = require('../utils/response.util');

const list        = async (req, res) => { try { return success(res, await alertService.list(req.user.tenant_id), 'Alertes récupérées'); } catch(err){ return error(res,err.message,400); } };
const create      = async (req, res) => { try { return success(res, await alertService.create(req.user.tenant_id, req.body), 'Alerte créée', 201); } catch(err){ return error(res,err.message,400); } };
const update      = async (req, res) => { try { return success(res, await alertService.update(req.user.tenant_id, req.params.id, req.body), 'Alerte mise à jour'); } catch(err){ return error(res,err.message,400); } };
const remove      = async (req, res) => { try { return success(res, await alertService.remove(req.user.tenant_id, req.params.id), 'Alerte supprimée'); } catch(err){ return error(res,err.message,400); } };
const getLogs     = async (req, res) => { try { const {page=1,limit=20,unread_only='false'} = req.query; const {logs,total} = await alertService.getLogs(req.user.tenant_id,{page,limit,unread_only:unread_only==='true'}); return paginate(res,logs,page,limit,total,'Logs récupérés'); } catch(err){ return error(res,err.message,400); } };
const markLogRead = async (req, res) => { try { return success(res, await alertService.markLogRead(req.user.tenant_id, req.params.logId, req.user.id), 'Alerte marquée comme lue'); } catch(err){ return error(res,err.message,400); } };

module.exports = { list, create, update, remove, getLogs, markLogRead };
