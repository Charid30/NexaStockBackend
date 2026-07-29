// src/controllers/company.controller.js
const tenantService = require('../services/tenant.service');
const { success, error } = require('../utils/response.util');

const getMyCompany = async (req, res) => {
  try {
    const tenant = await tenantService.getMyTenant(req.user.tenant_id);
    return success(res, tenant, 'Organisation récupérée');
  } catch (err) {
    return error(res, err.message, 404);
  }
};

const updateMyCompany = async (req, res) => {
  try {
    const tenant = await tenantService.updateMyTenant(req.user.tenant_id, req.body);
    return success(res, tenant, 'Organisation mise à jour');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

const updateLogo = async (req, res) => {
  try {
    if (!req.file) return error(res, 'Aucun fichier fourni', 400);
    const logoUrl = `/uploads/logos/${req.file.filename}`;
    const tenant  = await tenantService.updateMyTenant(req.user.tenant_id, { logo_url: logoUrl });
    return success(res, tenant, 'Logo mis à jour');
  } catch (err) {
    return error(res, err.message, 400);
  }
};

module.exports = { getMyCompany, updateMyCompany, updateLogo };
