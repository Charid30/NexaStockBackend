// src/routes/stock.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/stock.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { requireModule } = require('../middlewares/module.middleware');
const validate   = require('../middlewares/validate.middleware');
const { entreeSchema, sortieSchema, transfertSchema, ajustementSchema } = require('../validators/stock.validator');

router.use(authenticate, resolveTenant);

/**
 * @route   GET /api/stock
 * @desc    Niveaux de stock courants par produit/site
 * @access  manager, tenant_admin, auditeur, magasinier
 */
router.get('/', authorize('tenant_admin', 'manager', 'auditeur', 'magasinier', 'caissier'), controller.listLevels);

/**
 * @route   GET /api/stock/movements
 * @desc    Historique des mouvements (filtrable par produit, site, type, date)
 * @access  manager, tenant_admin, auditeur
 */
router.get('/movements', authorize('tenant_admin', 'manager', 'auditeur'), controller.listMovements);

/**
 * @route   POST /api/stock/entree
 * @desc    Enregistrer une entrée de stock
 * @access  manager, magasinier, tenant_admin
 */
router.post('/entree', authorize('tenant_admin', 'manager', 'magasinier'), validate(entreeSchema), controller.entree);

/**
 * @route   POST /api/stock/sortie
 * @desc    Enregistrer une sortie de stock
 * @access  manager, magasinier, caissier, tenant_admin
 */
router.post('/sortie', authorize('tenant_admin', 'manager', 'magasinier', 'caissier'), validate(sortieSchema), controller.sortie);

/**
 * @route   POST /api/stock/transfert
 * @desc    Transférer du stock entre deux sites (module MULTI_WAREHOUSE)
 * @access  manager, tenant_admin
 */
router.post('/transfert', authorize('tenant_admin', 'manager'), requireModule('MULTI_WAREHOUSE'), validate(transfertSchema), controller.transfert);

/**
 * @route   POST /api/stock/ajustement
 * @desc    Corriger le stock manuellement (inventaire)
 * @access  manager, tenant_admin
 */
router.post('/ajustement', authorize('tenant_admin', 'manager'), validate(ajustementSchema), controller.ajustement);

module.exports = router;
