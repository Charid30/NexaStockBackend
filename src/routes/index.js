// src/routes/index.js
const express = require('express');
const router  = express.Router();

router.use('/auth',                  require('./auth.routes'));
router.use('/admin/tenants',         require('./tenant.routes'));
router.use('/admin/agents',          require('./admin.agent.routes'));
router.use('/admin/utilisateurs',    require('./admin.utilisateurs.routes'));
router.use('/admin/roles',           require('./admin.roles.routes'));
router.use('/company',       require('./company.routes'));
router.use('/sites',      require('./site.routes'));
router.use('/users',      require('./user.routes'));
router.use('/categories', require('./category.routes'));
router.use('/units',      require('./unit.routes'));
router.use('/products',   require('./product.routes'));
router.use('/stock',      require('./stock.routes'));
router.use('/suppliers',  require('./supplier.routes'));
router.use('/orders',     require('./order.routes'));
router.use('/alerts',     require('./alert.routes'));
router.use('/reports',    require('./report.routes'));
router.use('/sales',      require('./sale.routes'));

module.exports = router;
