// src/routes/user.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/user.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const validate   = require('../middlewares/validate.middleware');
const { createUserSchema, updateUserSchema, assignSitesSchema, updateProfileSchema } = require('../validators/user.validator');

router.use(authenticate, resolveTenant);

/**
 * @route   GET /api/users/me
 * @desc    Profil de l'utilisateur connecté
 * @access  Tous les rôles
 */
router.get('/me', controller.getProfile);

/**
 * @route   PATCH /api/users/me
 * @desc    Mettre à jour son propre profil
 * @access  Tous les rôles
 */
router.patch('/me', validate(updateProfileSchema), controller.updateProfile);

/**
 * @route   GET /api/users
 * @desc    Liste les utilisateurs de l'organisation (filtrables par rôle)
 * @access  tenant_admin, manager
 */
router.get('/', authorize('tenant_admin', 'manager'), controller.list);

/**
 * @route   GET /api/users/:id
 * @desc    Détail d'un utilisateur avec ses sites
 * @access  tenant_admin, manager
 */
router.get('/:id', authorize('tenant_admin', 'manager'), controller.getById);

/**
 * @route   POST /api/users
 * @desc    Créer un utilisateur et l'affecter à des sites
 * @access  tenant_admin
 */
router.post('/', authorize('tenant_admin'), validate(createUserSchema), controller.create);

/**
 * @route   PATCH /api/users/:id
 * @desc    Modifier un utilisateur (nom, rôle, statut)
 * @access  tenant_admin
 */
router.patch('/:id', authorize('tenant_admin'), validate(updateUserSchema), controller.update);

/**
 * @route   PUT /api/users/:id/sites
 * @desc    Remplacer les affectations de sites d'un utilisateur
 * @access  tenant_admin
 */
router.put('/:id/sites', authorize('tenant_admin'), validate(assignSitesSchema), controller.assignSites);

/**
 * @route   DELETE /api/users/:id
 * @desc    Supprimer un utilisateur de l'organisation
 * @access  tenant_admin
 */
router.delete('/:id', authorize('tenant_admin'), controller.remove);

module.exports = router;
