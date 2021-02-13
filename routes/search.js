const router = require('express').Router();
const search = require('../controllers/search');

router.get('/', search.all);

module.exports = router;
