// src/routes/site.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/site.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const validate   = require('../middlewares/validate.middleware');
const { createSiteSchema, updateSiteSchema } = require('../validators/site.validator');

router.use(authenticate, resolveTenant);

/**
 * @route   GET /api/sites
 * @desc    Liste tous les sites de l'organisation
 * @access  tenant_admin, manager
 */
router.get('/', authorize('tenant_admin', 'manager', 'magasinier', 'caissier', 'auditeur'), controller.list);

/**
 * @route   GET /api/sites/:id
 * @desc    Détail d'un site (avec utilisateurs affectés)
 * @access  tenant_admin, manager, magasinier, caissier, auditeur
 */
router.get('/:id', authorize('tenant_admin', 'manager', 'magasinier', 'caissier', 'auditeur'), controller.getById);

/**
 * @route   POST /api/sites
 * @desc    Créer un nouveau site (boutique, annexe, entrepôt…)
 * @access  tenant_admin
 */
router.post('/', authorize('tenant_admin'), validate(createSiteSchema), controller.create);

/**
 * @route   PATCH /api/sites/:id
 * @desc    Modifier un site
 * @access  tenant_admin
 */
router.patch('/:id', authorize('tenant_admin'), validate(updateSiteSchema), controller.update);

/**
 * @route   DELETE /api/sites/:id
 * @desc    Supprimer un site (impossible s'il contient du stock)
 * @access  tenant_admin
 */
router.delete('/:id', authorize('tenant_admin'), controller.remove);

module.exports = router;
