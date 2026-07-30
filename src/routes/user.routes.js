// src/routes/user.routes.js
const express  = require('express');
const router   = express.Router();
const ctrl     = require('../controllers/user.controller');
const { authenticate } = require('../middlewares/auth.middleware');
const { resolveTenant } = require('../middlewares/tenant.middleware');
const { checkPermission } = require('../middlewares/permission.middleware');
const validate = require('../middlewares/validate.middleware');
const { createUserSchema, updateUserSchema, assignSitesSchema, updateProfileSchema } = require('../validators/user.validator');

router.use(authenticate, resolveTenant);

// Profil propre — accessible à tous les rôles sans vérification de permission
router.get('/me',    ctrl.getProfile);
router.patch('/me',  validate(updateProfileSchema), ctrl.updateProfile);

router.get('/',          checkPermission('utilisateurs', 'read'),   ctrl.list);
router.get('/:id',       checkPermission('utilisateurs', 'read'),   ctrl.getById);
router.post('/',         checkPermission('utilisateurs', 'create'),  validate(createUserSchema),   ctrl.create);
router.patch('/:id',     checkPermission('utilisateurs', 'update'),  validate(updateUserSchema),   ctrl.update);
router.put('/:id/sites', checkPermission('utilisateurs', 'update'),  validate(assignSitesSchema),  ctrl.assignSites);
router.delete('/:id',    checkPermission('utilisateurs', 'delete'),  ctrl.remove);

module.exports = router;
