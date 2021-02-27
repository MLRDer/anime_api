const router = require('express').Router();
const swagger = require('swagger-ui-express');
const setDocs = require('../../docs/middleware');
const docs = require('../../docs/v1');
const anime = require('./animes');
const collection = require('./collections');

router.use('/animes', anime);
router.use('/collections', collection);

// DOCS
router.use('/docs', swagger.serve);
router.get('/docs', setDocs(docs), swagger.setup(docs));

module.exports = router;
