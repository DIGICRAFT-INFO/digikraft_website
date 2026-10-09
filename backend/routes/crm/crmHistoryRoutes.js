const router = require('express').Router();
const ctrl = require('../../controllers/crm/crmHistoryController');
const { crmAuth, crmManagerOrAbove } = require('../../middleware/crmAuth');

router.get('/', crmAuth, crmManagerOrAbove, ctrl.list);

module.exports = router;
