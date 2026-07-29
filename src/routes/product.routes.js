// src/routes/product.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/product.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const validate   = require('../middlewares/validate.middleware');
const { uploadProduct } = require('../middlewares/upload.middleware');
const { createProductSchema, updateProductSchema } = require('../validators/product.validator');

router.use(authenticate, resolveTenant);

/**
 * @route   GET /api/products
 * @desc    Liste les produits (avec pagination, recherche, filtre catégorie)
 * @access  Tous les rôles
 */
router.get('/', controller.list);

/**
 * @route   GET /api/products/:id
 * @desc    Détail d'un produit avec niveaux de stock par site
 * @access  Tous les rôles
 */
router.get('/:id', controller.getById);

/**
 * @route   GET /api/products/:id/stock
 * @desc    Stock du produit sur tous les sites
 * @access  Tous les rôles
 */
router.get('/:id/stock', controller.getStock);

/**
 * @route   POST /api/products
 * @desc    Créer un produit (avec image optionnelle)
 * @access  tenant_admin, manager
 */
router.post('/', authorize('tenant_admin', 'manager'), uploadProduct, validate(createProductSchema), controller.create);

/**
 * @route   PATCH /api/products/:id
 * @desc    Modifier un produit
 * @access  tenant_admin, manager
 */
router.patch('/:id', authorize('tenant_admin', 'manager'), uploadProduct, validate(updateProductSchema), controller.update);

/**
 * @route   DELETE /api/products/:id
 * @desc    Supprimer un produit (impossible s'il a du stock)
 * @access  tenant_admin
 */
router.delete('/:id', authorize('tenant_admin'), controller.remove);

module.exports = router;
