const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/sale.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate     = require('../middlewares/validate.middleware');
const { createSaleSchema } = require('../validators/sale.validator');

router.use(authenticate);

router.get('/',    authorize('tenant_admin', 'manager', 'caissier'), controller.list);
router.get('/:id', authorize('tenant_admin', 'manager', 'caissier'), controller.getById);
router.post('/',   authorize('tenant_admin', 'manager', 'caissier'), validate(createSaleSchema), controller.create);

module.exports = router;
