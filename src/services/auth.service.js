// src/services/auth.service.js
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { sequelize, Tenant, TenantModule, User, RefreshToken } = require('../models');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt.util');

const DEFAULT_MODULES = ['MULTI_WAREHOUSE', 'SUPPLIERS', 'ORDERS', 'ALERTS', 'REPORTS', 'AUDIT_LOG'];

/**
 * Inscription d'un propriétaire : crée le tenant et le compte tenant_admin.
 * La création des sites se fait ensuite depuis le tableau de bord.
 */
const register = async (data) => {
  const {
    company_name, company_phone, company_email, company_ifu, company_rccm,
    first_name, last_name, phone, email, password,
  } = data;

  const existingPhone = await User.findOne({ where: { phone } });
  if (existingPhone) throw new Error('Ce numéro de téléphone est déjà utilisé');

  if (email) {
    const existingEmail = await User.findOne({ where: { email } });
    if (existingEmail) throw new Error('Cette adresse email est déjà utilisée');
  }

  const t = await sequelize.transaction();
  try {
    const tenant = await Tenant.create({
      name:        company_name,
      phone:       company_phone,
      email:       company_email || null,
      ifu_number:  company_ifu  || null,
      rccm_number: company_rccm || null,
    }, { transaction: t });

    await TenantModule.bulkCreate(
      DEFAULT_MODULES.map((code) => ({
        tenant_id:    tenant.id,
        module_code:  code,
        is_active:    1,
        activated_at: new Date(),
      })),
      { transaction: t },
    );

    const user = await User.create({
      tenant_id:     tenant.id,
      first_name,
      last_name,
      phone,
      email:         email || null,
      password_hash: password,
      role:          'tenant_admin',
    }, { transaction: t });

    await t.commit();

    const accessToken  = generateToken({ id: user.id, tenant_id: tenant.id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user.id });

    await _saveRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken, user, tenant };
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/**
 * Connexion par téléphone et mot de passe.
 */
const login = async ({ phone, password }) => {
  const cleanPhone = (phone || '').trim();

  const user = await User.findOne({ where: { phone: cleanPhone } });

  if (!user) throw new Error('Numéro ou mot de passe incorrect');
  if (!user.is_active) throw new Error('Compte suspendu. Contactez le support.');

  if (user.role !== 'super_admin' && user.tenant_id) {
    const tenant = await Tenant.findByPk(user.tenant_id);
    if (tenant && !tenant.is_active) {
      throw new Error('Votre organisation est suspendue. Contactez le support.');
    }
  }

  const isValid = await user.comparePassword(password);
  if (!isValid) throw new Error('Numéro ou mot de passe incorrect');

  await user.update({ last_login_at: new Date() });

  const accessToken  = generateToken({ id: user.id, tenant_id: user.tenant_id, role: user.role });
  const refreshToken = generateRefreshToken({ id: user.id });

  await _saveRefreshToken(user.id, refreshToken);

  return { accessToken, refreshToken, user };
};

/**
 * Rafraîchit l'access token à partir d'un refresh token valide.
 */
const refresh = async ({ refresh_token }) => {
  let decoded;
  try {
    decoded = verifyRefreshToken(refresh_token);
  } catch {
    throw new Error('Refresh token invalide ou expiré');
  }

  const tokenHash = _hashToken(refresh_token);
  const stored = await RefreshToken.findOne({
    where: { user_id: decoded.id, token_hash: tokenHash },
  });

  if (!stored || stored.revoked_at || new Date() > new Date(stored.expires_at)) {
    throw new Error('Refresh token révoqué ou expiré');
  }

  const user = await User.findByPk(decoded.id);
  if (!user || !user.is_active) throw new Error('Utilisateur introuvable ou inactif');

  const accessToken = generateToken({ id: user.id, tenant_id: user.tenant_id, role: user.role });

  return { accessToken };
};

/**
 * Révoque le refresh token (déconnexion).
 */
const logout = async ({ refresh_token }) => {
  const tokenHash = _hashToken(refresh_token);
  await RefreshToken.update(
    { revoked_at: new Date() },
    { where: { token_hash: tokenHash } },
  );
  return { logged_out: true };
};

/**
 * Retourne le profil de l'utilisateur connecté.
 */
const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    include: [
      { association: 'tenant' },
      { association: 'sites', attributes: ['id', 'name', 'type'] },
    ],
  });
  if (!user) throw new Error('Utilisateur introuvable');
  return user;
};

/**
 * Modifie le mot de passe après vérification de l'ancien.
 */
const changePassword = async (userId, { current_password, new_password }) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error('Utilisateur introuvable');

  const isValid = await user.comparePassword(current_password);
  if (!isValid) throw new Error('Mot de passe actuel incorrect');

  await user.update({ password_hash: new_password });
  return { updated: true };
};

// ─── Helpers privés ───────────────────────────────────────────────────────────

const _hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const _saveRefreshToken = async (userId, token) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  await RefreshToken.create({
    user_id:    userId,
    token_hash: _hashToken(token),
    expires_at: expiresAt,
  });
};

module.exports = { register, login, refresh, logout, getProfile, changePassword };
