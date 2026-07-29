// src/controllers/order.controller.js
const orderService = require('../services/order.service');
const { success, error, paginate } = require('../utils/response.util');

const list    = async (req, res) => { try { const {page=1,limit=20,status='',supplier_id=''} = req.query; const {orders,total} = await orderService.list(req.user.tenant_id,{page,limit,status,supplier_id}); return paginate(res,orders,page,limit,total,'Commandes récupérées'); } catch(err){ return error(res,err.message,400); } };
const getById = async (req, res) => { try { return success(res, await orderService.getById(req.user.tenant_id, req.params.id), 'Commande récupérée'); } catch(err){ return error(res,err.message,404); } };
const create  = async (req, res) => { try { return success(res, await orderService.create(req.user.tenant_id, req.user.id, req.body), 'Commande créée', 201); } catch(err){ return error(res,err.message,400); } };
const send    = async (req, res) => { try { return success(res, await orderService.send(req.user.tenant_id, req.params.id), 'Commande envoyée'); } catch(err){ return error(res,err.message,400); } };
const receive = async (req, res) => { try { return success(res, await orderService.receive(req.user.tenant_id, req.user.id, req.params.id, req.body), 'Réception enregistrée'); } catch(err){ return error(res,err.message,400); } };
const cancel  = async (req, res) => { try { return success(res, await orderService.cancel(req.user.tenant_id, req.params.id), 'Commande annulée'); } catch(err){ return error(res,err.message,400); } };

module.exports = { list, getById, create, send, receive, cancel };
