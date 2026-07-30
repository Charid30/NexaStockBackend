// src/routes/supplier.routes.js
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/supplier.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const { requireModule } = require('../middlewares/module.middleware');
const validate = require('../middlewares/validate.middleware');
const { createSupplierSchema, updateSupplierSchema } = require('../validators/supplier.validator');

router.use(authenticate, resolveTenant, requireModule('SUPPLIERS'));

router.get('/',      checkPermission('fournisseurs', 'read'),   ctrl.list);
router.get('/:id',   checkPermission('fournisseurs', 'read'),   ctrl.getById);
router.post('/',     checkPermission('fournisseurs', 'create'),  validate(createSupplierSchema), ctrl.create);
router.patch('/:id', checkPermission('fournisseurs', 'update'),  validate(updateSupplierSchema), ctrl.update);
router.delete('/:id',checkPermission('fournisseurs', 'delete'),  ctrl.remove);

module.exports = router;
