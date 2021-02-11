const router = require('express').Router();
const hdrezka = require('../controllers/hdrezka');

router.get('/id', hdrezka.getID);
router.get('/available', hdrezka.getAllAvailableTranslators);
router.get('/imdb', hdrezka.getIMDbInfo);
router.post('/sources', hdrezka.getSources);

module.exports = router;
