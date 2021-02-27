const router = require('express').Router();
const search = require('../../controllers/v2/search');

router.get('/', search.all);

module.exports = router;
