const router = require('express').Router();
const ctrl = require('../../controllers/hrm/hrmEmployeeController');
const { hrmAuth, hrmManagerOrAbove, hrmDeptScope, hrmAnyRole } = require('../../middleware/hrmAuth');

router.use(hrmAuth, hrmDeptScope);

router.get('/',            hrmAnyRole,         ctrl.list);
router.get('/:id',         hrmAnyRole,         ctrl.getOne);
router.post('/',           hrmManagerOrAbove,  ctrl.create);
router.patch('/:id',       hrmAnyRole,         ctrl.update);
router.put('/:id/deactivate', hrmManagerOrAbove, ctrl.deactivate);
router.post('/:id/reset-password', hrmManagerOrAbove, ctrl.resetPassword);

module.exports = router;
