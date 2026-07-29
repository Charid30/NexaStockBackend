// src/routes/company.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/company.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const validate   = require('../middlewares/validate.middleware');
const { uploadLogo } = require('../middlewares/upload.middleware');
const { updateCompanySchema } = require('../validators/company.validator');

router.use(authenticate, resolveTenant, authorize('tenant_admin'));

/**
 * @route   GET /api/company
 * @desc    Informations de sa propre organisation (+ modules actifs)
 * @access  tenant_admin
 */
router.get('/', controller.getMyCompany);

/**
 * @route   PATCH /api/company
 * @desc    Modifier les informations textuelles de l'organisation
 * @access  tenant_admin
 */
router.patch('/', validate(updateCompanySchema), controller.updateMyCompany);

/**
 * @route   PATCH /api/company/logo
 * @desc    Mettre à jour le logo de l'organisation
 * @access  tenant_admin
 */
router.patch('/logo', uploadLogo, controller.updateLogo);

module.exports = router;
