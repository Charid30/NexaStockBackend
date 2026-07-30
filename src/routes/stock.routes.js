// src/routes/stock.routes.js
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/stock.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const { requireModule } = require('../middlewares/module.middleware');
const validate = require('../middlewares/validate.middleware');
const { entreeSchema, sortieSchema, transfertSchema, ajustementSchema } = require('../validators/stock.validator');

router.use(authenticate, resolveTenant);

router.get('/',             checkPermission('stock', 'read'),   ctrl.listLevels);
router.get('/movements',    checkPermission('stock', 'read'),   ctrl.listMovements);
router.post('/entree',      checkPermission('stock', 'create'),  validate(entreeSchema),      ctrl.entree);
router.post('/sortie',      checkPermission('stock', 'create'),  validate(sortieSchema),      ctrl.sortie);
router.post('/transfert',   checkPermission('stock', 'update'),  requireModule('MULTI_WAREHOUSE'), validate(transfertSchema), ctrl.transfert);
router.post('/ajustement',  checkPermission('stock', 'update'),  validate(ajustementSchema),  ctrl.ajustement);

module.exports = router;
