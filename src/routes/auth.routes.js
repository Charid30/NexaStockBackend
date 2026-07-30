// src/routes/auth.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const validate   = require('../middlewares/validate.middleware');
const {
  registerSchema,
  loginSchema,
  refreshSchema,
  changePasswordSchema,
} = require('../validators/auth.validator');

/**
 * @route   POST /api/auth/register
 * @desc    Inscription propriétaire : crée tenant + compte tenant_admin
 * @access  Public
 */
router.post('/register', validate(registerSchema), controller.register);

/**
 * @route   POST /api/auth/login
 * @desc    Connexion par téléphone et mot de passe
 * @access  Public
 */
router.post('/login', validate(loginSchema), controller.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Rafraîchit l'access token via le refresh token
 * @access  Public
 */
router.post('/refresh', validate(refreshSchema), controller.refresh);

/**
 * @route   POST /api/auth/logout
 * @desc    Révoque le refresh token (déconnexion)
 * @access  Public
 */
router.post('/logout', controller.logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Retourne le profil de l'utilisateur connecté (avec tenant et sites)
 * @access  Private
 */
router.get('/profile', authenticate, controller.getProfile);

/**
 * @route   PATCH /api/auth/password
 * @desc    Modifie le mot de passe après vérification de l'ancien
 * @access  Private
 */
router.patch('/password', authenticate, validate(changePasswordSchema), controller.changePassword);

router.get('/permissions', authenticate, controller.getPermissions);

module.exports = router;
