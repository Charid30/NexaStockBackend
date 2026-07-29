// src/routes/category.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/category.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const validate   = require('../middlewares/validate.middleware');
const { createCategorySchema, updateCategorySchema } = require('../validators/category.validator');

router.use(authenticate, resolveTenant);

router.get('/',     controller.list);
router.get('/:id',  controller.getById);
router.post('/',    authorize('tenant_admin', 'manager'), validate(createCategorySchema), controller.create);
router.patch('/:id', authorize('tenant_admin', 'manager'), validate(updateCategorySchema), controller.update);
router.delete('/:id', authorize('tenant_admin', 'manager'), controller.remove);

module.exports = router;
