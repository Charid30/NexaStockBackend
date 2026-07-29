// src/routes/tenant.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/tenant.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate   = require('../middlewares/validate.middleware');
const { updateTenantSchema, toggleModuleSchema } = require('../validators/tenant.validator');

// Toutes les routes sont réservées au super_admin
router.use(authenticate, authorize('super_admin'));

/**
 * @route   GET /api/admin/tenants
 * @desc    Liste toutes les organisations (avec pagination et recherche)
 * @access  super_admin
 */
router.get('/', controller.list);

/**
 * @route   GET /api/admin/tenants/stats
 * @desc    Statistiques globales de la plateforme
 * @access  super_admin
 */
router.get('/stats', controller.getStats);

/**
 * @route   GET /api/admin/tenants/:id
 * @desc    Détail d'une organisation (sites, users, modules)
 * @access  super_admin
 */
router.get('/:id', controller.getById);

/**
 * @route   PATCH /api/admin/tenants/:id
 * @desc    Modifier une organisation (nom, statut, etc.)
 * @access  super_admin
 */
router.patch('/:id', validate(updateTenantSchema), controller.update);

/**
 * @route   PATCH /api/admin/tenants/:id/modules
 * @desc    Activer ou désactiver un module pour une organisation
 * @access  super_admin
 */
router.patch('/:id/modules', validate(toggleModuleSchema), controller.toggleModule);

module.exports = router;
