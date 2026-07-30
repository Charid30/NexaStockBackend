// src/routes/product.routes.js
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/product.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const { uploadProduct } = require('../middlewares/upload.middleware');
const { createProductSchema, updateProductSchema } = require('../validators/product.validator');

router.use(authenticate, resolveTenant);

router.get('/',           checkPermission('produits', 'read'),   ctrl.list);
router.get('/:id',        checkPermission('produits', 'read'),   ctrl.getById);
router.get('/:id/stock',  checkPermission('produits', 'read'),   ctrl.getStock);
router.post('/',          checkPermission('produits', 'create'),  uploadProduct, validate(createProductSchema), ctrl.create);
router.patch('/:id',      checkPermission('produits', 'update'),  uploadProduct, validate(updateProductSchema), ctrl.update);
router.delete('/:id',     checkPermission('produits', 'delete'),  ctrl.remove);

module.exports = router;
