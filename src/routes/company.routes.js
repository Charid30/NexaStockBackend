// src/routes/company.routes.js
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/company.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const { uploadLogo } = require('../middlewares/upload.middleware');
const { updateCompanySchema } = require('../validators/company.validator');

router.use(authenticate, resolveTenant);

router.get('/',       checkPermission('entreprise', 'read'),   ctrl.getMyCompany);
router.patch('/',     checkPermission('entreprise', 'update'),  validate(updateCompanySchema), ctrl.updateMyCompany);
router.patch('/logo', checkPermission('entreprise', 'update'),  uploadLogo, ctrl.updateLogo);

module.exports = router;
