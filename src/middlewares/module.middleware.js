// src/middlewares/module.middleware.js
const { TenantModule } = require('../models');
const { error }        = require('../utils/response.util');

const requireModule = (moduleCode) => async (req, res, next) => {
  try {
    const tenantId = req.user?.tenant_id;
    if (!tenantId) return error(res, 'Tenant non identifié', 400);

    const mod = await TenantModule.findOne({
      where: { tenant_id: tenantId, module_code: moduleCode, is_active: 1 },
    });

    if (!mod) {
      return error(res, `Le module "${moduleCode}" n'est pas activé pour votre organisation`, 403);
    }

    next();
  } catch {
    return error(res, 'Erreur lors de la vérification du module', 500);
  }
};

module.exports = { requireModule };
