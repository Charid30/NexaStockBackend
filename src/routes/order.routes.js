// src/routes/order.routes.js
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/order.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const { requireModule } = require('../middlewares/module.middleware');
const validate = require('../middlewares/validate.middleware');
const { createOrderSchema, receiveOrderSchema } = require('../validators/order.validator');

router.use(authenticate, resolveTenant, requireModule('ORDERS'));

router.get('/',               checkPermission('commandes', 'read'),   ctrl.list);
router.get('/:id',            checkPermission('commandes', 'read'),   ctrl.getById);
router.post('/',              checkPermission('commandes', 'create'),  validate(createOrderSchema), ctrl.create);
router.patch('/:id/send',     checkPermission('commandes', 'update'),  ctrl.send);
router.post('/:id/receive',   checkPermission('commandes', 'update'),  validate(receiveOrderSchema), ctrl.receive);
router.patch('/:id/cancel',   checkPermission('commandes', 'update'),  ctrl.cancel);

module.exports = router;
