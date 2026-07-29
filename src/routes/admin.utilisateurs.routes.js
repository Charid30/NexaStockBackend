// src/routes/admin.utilisateurs.routes.js
const router     = require('express').Router();
const ctrl       = require('../controllers/admin.utilisateurs.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');

const ADMIN_ROLES = ['super_admin', 'nexalab_support', 'nexalab_commercial', 'nexalab_technique'];

router.use(authenticate, authorize(...ADMIN_ROLES));

router.get('/',              ctrl.list);
router.patch('/:id/toggle',  ctrl.toggleStatus);

module.exports = router;
