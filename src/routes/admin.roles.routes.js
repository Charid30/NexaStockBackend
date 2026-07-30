// src/routes/admin.roles.routes.js
const router     = require('express').Router();
const ctrl       = require('../controllers/admin.roles.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const v          = require('../validators/admin.roles.validator');

router.use(authenticate, authorize('super_admin', 'nexalab_technique'));

router.get('/permissions',              ctrl.listPermissions);
router.get('/',                         ctrl.listRoles);
router.post('/',  validate(v.createRole), ctrl.createRole);
router.get('/:id',                      ctrl.getRole);
router.put('/:id', validate(v.updateRole), ctrl.updateRole);
router.delete('/:id',                   ctrl.deleteRole);
router.get('/:id/permissions',          ctrl.getRolePermissions);
router.put('/:id/permissions', validate(v.setPermissions), ctrl.setRolePermissions);

module.exports = router;
