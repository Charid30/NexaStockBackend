// src/routes/category.routes.js
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/category.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const { createCategorySchema, updateCategorySchema } = require('../validators/category.validator');

router.use(authenticate, resolveTenant);

router.get('/',      checkPermission('categories', 'read'),   ctrl.list);
router.get('/:id',   checkPermission('categories', 'read'),   ctrl.getById);
router.post('/',     checkPermission('categories', 'create'),  validate(createCategorySchema), ctrl.create);
router.patch('/:id', checkPermission('categories', 'update'),  validate(updateCategorySchema), ctrl.update);
router.delete('/:id',checkPermission('categories', 'delete'),  ctrl.remove);

module.exports = router;
