// src/controllers/report.controller.js
const reportService = require('../services/report.service');
const { success, error } = require('../utils/response.util');

const dashboard       = async (req, res) => { try { return success(res, await reportService.dashboard(req.user.tenant_id), 'Tableau de bord récupéré'); } catch(err){ return error(res,err.message,500); } };
const stockValuation  = async (req, res) => { try { return success(res, await reportService.stockValuation(req.user.tenant_id, req.query.site_id), 'Valorisation récupérée'); } catch(err){ return error(res,err.message,500); } };
const movementsSummary= async (req, res) => { try { return success(res, await reportService.movementsSummary(req.user.tenant_id, req.query), 'Résumé des mouvements récupéré'); } catch(err){ return error(res,err.message,500); } };
const lowStockProducts= async (req, res) => { try { return success(res, await reportService.lowStockProducts(req.user.tenant_id), 'Produits en rupture récupérés'); } catch(err){ return error(res,err.message,500); } };

module.exports = { dashboard, stockValuation, movementsSummary, lowStockProducts };
