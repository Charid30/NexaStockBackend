// src/middlewares/auth.middleware.js
const { verifyToken } = require('../utils/jwt.util');
const { error }       = require('../utils/response.util');

const extractToken = (req) => {
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.substring(7);
  return null;
};

const authenticate = (req, res, next) => {
  try {
    const token = extractToken(req);
    if (!token) return error(res, 'Token manquant ou invalide', 401);

    const decoded = verifyToken(token);

    req.user = {
      id:        decoded.id,
      tenant_id: decoded.tenant_id || null,
      role:      decoded.role,
    };

    next();
  } catch {
    return error(res, 'Token invalide ou expiré', 401);
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return error(res, 'Non authentifié', 401);
  if (!roles.includes(req.user.role)) {
    return error(res, 'Accès refusé : permissions insuffisantes', 403);
  }
  next();
};

module.exports = { authenticate, authorize };
