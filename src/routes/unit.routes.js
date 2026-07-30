// src/routes/unit.routes.js
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/unit.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const { createUnitSchema, updateUnitSchema } = require('../validators/unit.validator');

router.use(authenticate, resolveTenant);

router.get('/',      checkPermission('unites', 'read'),   ctrl.list);
router.post('/',     checkPermission('unites', 'create'),  validate(createUnitSchema), ctrl.create);
router.patch('/:id', checkPermission('unites', 'update'),  validate(updateUnitSchema), ctrl.update);
router.delete('/:id',checkPermission('unites', 'delete'),  ctrl.remove);

module.exports = router;
