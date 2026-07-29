// src/routes/supplier.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/supplier.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { requireModule } = require('../middlewares/module.middleware');
const validate   = require('../middlewares/validate.middleware');
const { createSupplierSchema, updateSupplierSchema } = require('../validators/supplier.validator');

router.use(authenticate, resolveTenant, requireModule('SUPPLIERS'));

router.get('/',      authorize('tenant_admin','manager','auditeur'), controller.list);
router.get('/:id',   authorize('tenant_admin','manager','auditeur'), controller.getById);
router.post('/',     authorize('tenant_admin','manager'), validate(createSupplierSchema), controller.create);
router.patch('/:id', authorize('tenant_admin','manager'), validate(updateSupplierSchema), controller.update);
router.delete('/:id',authorize('tenant_admin'), controller.remove);

module.exports = router;
