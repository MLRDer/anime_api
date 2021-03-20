const router = require('express').Router();
const swagger = require('swagger-ui-express');
const setDocs = require('../../docs/middleware');
const docs = require('../../docs/v3');
const hdrezka = require('./hdrezka');
const notifications = require('./notifications');

const actor = require('../v2/actors');
const movie = require('../v2/movies');
const search = require('../v2/search');
const category = require('../v2/categories');
const collection = require('../v2/collection');

router.use('/hdrezka', hdrezka);
router.use('/notifications', notifications);

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
