// src/routes/report.routes.js
const express    = require('express');
const router     = express.Router();
const controller = require('../controllers/report.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { requireModule } = require('../middlewares/module.middleware');

router.use(authenticate, resolveTenant);

// Dashboard disponible sans le module REPORTS
router.get('/dashboard', controller.dashboard);

// Les autres rapports nécessitent le module REPORTS
router.use(requireModule('REPORTS'));

router.get('/stock-valuation',   authorize('tenant_admin','manager','auditeur'), controller.stockValuation);
router.get('/movements-summary', authorize('tenant_admin','manager','auditeur'), controller.movementsSummary);
router.get('/low-stock',         controller.lowStockProducts);

module.exports = router;
