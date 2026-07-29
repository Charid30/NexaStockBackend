// src/middlewares/tenant.middleware.js
const { Tenant } = require('../models');
const { error }  = require('../utils/response.util');

const resolveTenant = async (req, res, next) => {
  try {
    if (!req.user?.tenant_id) return error(res, 'Tenant non identifié', 400);

    const tenant = await Tenant.findByPk(req.user.tenant_id);
    if (!tenant)          return error(res, 'Organisation introuvable', 404);
    if (!tenant.is_active) return error(res, 'Votre organisation est suspendue. Contactez le support.', 403);

    req.tenant = tenant;
    next();
  } catch {
    return error(res, 'Erreur lors de la résolution du tenant', 500);
  }
};

module.exports = { resolveTenant };
