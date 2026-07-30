// src/routes/sale.routes.js
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/sale.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const { createSaleSchema } = require('../validators/sale.validator');

router.use(authenticate);

router.get('/',    checkPermission('ventes', 'read'),   ctrl.list);
router.get('/:id', checkPermission('ventes', 'read'),   ctrl.getById);
router.post('/',   checkPermission('ventes', 'create'),  validate(createSaleSchema), ctrl.create);

module.exports = router;
