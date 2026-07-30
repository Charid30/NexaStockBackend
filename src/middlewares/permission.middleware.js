// src/middlewares/permission.middleware.js
const { sequelize } = require('../models');
const { error }     = require('../utils/response.util');

// Rôles NexaLab qui contournent les vérifications de permissions tenant
const BYPASS_ROLES = new Set(['super_admin', 'nexalab_support', 'nexalab_commercial', 'nexalab_technique']);

// Cache en mémoire : roleName → Set<"module.action">
const _cache   = new Map();
const TTL_MS   = 5 * 60 * 1000; // 5 minutes
let _cacheTime = 0;

const _loadRole = async (roleName) => {
  const [rows] = await sequelize.query(
    `SELECT p.module, p.action
     FROM role_permissions rp
     JOIN roles r       ON rp.role_id       = r.id  AND r.del = 0
     JOIN permissions p ON rp.permission_id = p.id
     WHERE r.name = ?`,
    { replacements: [roleName] },
  );
  return new Set(rows.map((r) => `${r.module}.${r.action}`));
};

const _getPermSet = async (roleName) => {
  if (Date.now() - _cacheTime > TTL_MS) {
    _cache.clear();
    _cacheTime = Date.now();
  }
  if (!_cache.has(roleName)) {
    _cache.set(roleName, await _loadRole(roleName));
  }
  return _cache.get(roleName);
};

/**
 * Middleware de vérification de permission.
 * Usage : checkPermission('produits', 'create')
 */
const checkPermission = (module, action) => async (req, res, next) => {
  try {
    const { role } = req.user;

    // Rôles NexaLab : accès complet
    if (BYPASS_ROLES.has(role)) return next();

    const permSet = await _getPermSet(role);
    if (!permSet.has(`${module}.${action}`)) {
      return error(res, `Accès refusé : permission "${module}.${action}" requise`, 403);
    }
    next();
  } catch (err) {
    return error(res, 'Erreur lors de la vérification des permissions', 500);
  }
};

/** Vider le cache (appelé après mise à jour des permissions via l'admin). */
const invalidatePermissionCache = () => {
  _cache.clear();
  _cacheTime = 0;
};

/** Retourne le Set de permissions d'un rôle (avec cache). */
const getUserPermissions = (roleName) => _getPermSet(roleName);

module.exports = { checkPermission, invalidatePermissionCache, getUserPermissions };
