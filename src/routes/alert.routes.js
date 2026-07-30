// src/routes/alert.routes.js
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/alert.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const { requireModule } = require('../middlewares/module.middleware');
const validate = require('../middlewares/validate.middleware');
const { createAlertSchema, updateAlertSchema } = require('../validators/alert.validator');

router.use(authenticate, resolveTenant, requireModule('ALERTS'));

router.get('/logs',           checkPermission('alertes', 'read'),   ctrl.getLogs);
router.patch('/logs/:logId',  checkPermission('alertes', 'read'),   ctrl.markLogRead);
router.get('/',               checkPermission('alertes', 'read'),   ctrl.list);
router.post('/',              checkPermission('alertes', 'create'),  validate(createAlertSchema), ctrl.create);
router.patch('/:id',          checkPermission('alertes', 'update'),  validate(updateAlertSchema), ctrl.update);
router.delete('/:id',         checkPermission('alertes', 'delete'),  ctrl.remove);

module.exports = router;
