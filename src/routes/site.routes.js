// src/routes/site.routes.js
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/site.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const { createSiteSchema, updateSiteSchema } = require('../validators/site.validator');

router.use(authenticate, resolveTenant);

router.get('/',      checkPermission('sites', 'read'),   ctrl.list);
router.get('/:id',   checkPermission('sites', 'read'),   ctrl.getById);
router.post('/',     checkPermission('sites', 'create'),  validate(createSiteSchema), ctrl.create);
router.patch('/:id', checkPermission('sites', 'update'),  validate(updateSiteSchema), ctrl.update);
router.delete('/:id',checkPermission('sites', 'delete'),  ctrl.remove);

module.exports = router;
