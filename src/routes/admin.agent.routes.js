// src/routes/admin.agent.routes.js
const router     = require('express').Router();
const ctrl       = require('../controllers/admin.agent.controller');
const { authenticate, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const v          = require('../validators/admin.agent.validator');

router.use(authenticate, authorize('super_admin', 'nexalab_technique'));

router.get('/',         ctrl.list);
router.post('/',        validate(v.create),     ctrl.create);
router.put('/:id',      validate(v.update),     ctrl.update);
router.patch('/:id/toggle', ctrl.toggleStatus);
router.delete('/:id',   ctrl.remove);

module.exports = router;
