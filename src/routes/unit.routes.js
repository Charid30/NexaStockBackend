// src/routes/unit.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/unit.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const validate   = require('../middlewares/validate.middleware');
const { createUnitSchema, updateUnitSchema } = require('../validators/unit.validator');

router.use(authenticate, resolveTenant);

router.get('/',      controller.list);
router.post('/',     authorize('tenant_admin', 'manager'), validate(createUnitSchema), controller.create);
router.patch('/:id', authorize('tenant_admin', 'manager'), validate(updateUnitSchema), controller.update);
router.delete('/:id', authorize('tenant_admin', 'manager'), controller.remove);

module.exports = router;
