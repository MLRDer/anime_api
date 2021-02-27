const router = require('express').Router();
const swagger = require('swagger-ui-express');
const setDocs = require('../../docs/middleware');
const docs = require('../../docs/v2');
const actor = require('./actors');
const movie = require('./movies');
const search = require('./search');
const hdrezka = require('./hdrezka');
const category = require('./categories');
const collection = require('./collection');

router.use('/movies', movie);
router.use('/categories', category);
router.use('/actors', actor);
router.use('/collections', collection);
router.use('/hdrezka', hdrezka);
router.use('/search', search);

// DOCS
router.use('/docs', swagger.serve);
router.get('/docs', setDocs(docs), swagger.setup(docs));

module.exports = router;
