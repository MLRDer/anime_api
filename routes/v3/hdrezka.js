const router = require('express').Router();
const hdrezka = require('../../controllers/v3/hdrezka');
const hdrezkaV2 = require('../../controllers/v2/hdrezka');

router.get('/id', hdrezkaV2.getID);
router.get('/available', hdrezkaV2.getAllAvailableTranslators);
router.get('/imdb', hdrezkaV2.getIMDbInfo);
router.post('/sources', hdrezka.getSources);

module.exports = router;
