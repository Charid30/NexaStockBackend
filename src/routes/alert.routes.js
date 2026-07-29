// src/routes/alert.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/alert.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { requireModule } = require('../middlewares/module.middleware');
const validate   = require('../middlewares/validate.middleware');
const { createAlertSchema, updateAlertSchema } = require('../validators/alert.validator');

router.use(authenticate, resolveTenant, requireModule('ALERTS'));

router.get('/logs',           authorize('tenant_admin','manager','auditeur'), controller.getLogs);
router.patch('/logs/:logId',  authorize('tenant_admin','manager','auditeur'), controller.markLogRead);
router.get('/',               authorize('tenant_admin','manager'), controller.list);
router.post('/',              authorize('tenant_admin','manager'), validate(createAlertSchema), controller.create);
router.patch('/:id',          authorize('tenant_admin','manager'), validate(updateAlertSchema), controller.update);
router.delete('/:id',         authorize('tenant_admin'), controller.remove);

module.exports = router;
