const router = require('express').Router();
const hdrezka = require('../controllers/hdrezka');

router.get('/id', hdrezka.getID);
router.get('/available', hdrezka.getAllAvailableTranslators);
router.post('/sources', hdrezka.getSources);
router.post('/imdb', hdrezka.getIMDbInfo);

module.exports = router;
