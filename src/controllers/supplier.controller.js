// src/controllers/supplier.controller.js
const supplierService = require('../services/supplier.service');
const { success, error, paginate } = require('../utils/response.util');

const list    = async (req, res) => { try { const { page=1,limit=20,search=''} = req.query; const {suppliers,total} = await supplierService.list(req.user.tenant_id,{page,limit,search}); return paginate(res,suppliers,page,limit,total,'Fournisseurs récupérés'); } catch(err){ return error(res,err.message,400); } };
const getById = async (req, res) => { try { return success(res, await supplierService.getById(req.user.tenant_id, req.params.id), 'Fournisseur récupéré'); } catch(err){ return error(res,err.message,404); } };
const create  = async (req, res) => { try { return success(res, await supplierService.create(req.user.tenant_id, req.body), 'Fournisseur créé', 201); } catch(err){ return error(res,err.message,400); } };
const update  = async (req, res) => { try { return success(res, await supplierService.update(req.user.tenant_id, req.params.id, req.body), 'Fournisseur mis à jour'); } catch(err){ return error(res,err.message,400); } };
const remove  = async (req, res) => { try { return success(res, await supplierService.remove(req.user.tenant_id, req.params.id), 'Fournisseur supprimé'); } catch(err){ return error(res,err.message,400); } };

module.exports = { list, getById, create, update, remove };
