// src/routes/report.routes.js
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/report.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const { requireModule } = require('../middlewares/module.middleware');

router.use(authenticate, resolveTenant);

// Dashboard disponible sans le module REPORTS
router.get('/dashboard', ctrl.dashboard);

router.use(requireModule('REPORTS'));

router.get('/stock-valuation',   checkPermission('rapports', 'read'), ctrl.stockValuation);
router.get('/movements-summary', checkPermission('rapports', 'read'), ctrl.movementsSummary);
router.get('/low-stock',         checkPermission('rapports', 'read'), ctrl.lowStockProducts);

module.exports = router;
