// src/routes/order.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { requireModule } = require('../middlewares/module.middleware');
const validate   = require('../middlewares/validate.middleware');
const { createOrderSchema, receiveOrderSchema } = require('../validators/order.validator');

router.use(authenticate, resolveTenant, requireModule('ORDERS'));

/**
 * @route   GET    /api/orders
 * @route   POST   /api/orders
 * @route   GET    /api/orders/:id
 * @route   POST   /api/orders/:id/receive
 * @route   PATCH  /api/orders/:id/cancel
 */
router.get('/',                authorize('tenant_admin','manager','auditeur'), controller.list);
router.post('/',               authorize('tenant_admin','manager'), validate(createOrderSchema), controller.create);
router.get('/:id',             authorize('tenant_admin','manager','auditeur'), controller.getById);
router.patch('/:id/send',      authorize('tenant_admin','manager'), controller.send);
router.post('/:id/receive',    authorize('tenant_admin','manager','magasinier'), validate(receiveOrderSchema), controller.receive);
router.patch('/:id/cancel',    authorize('tenant_admin','manager'), controller.cancel);

module.exports = router;
