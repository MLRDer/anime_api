const router = require('express').Router();
const swagger = require('swagger-ui-express');
const setDocs = require('../../docs/middleware');
const docs = require('../../docs/v3');
const hdrezka = require('./hdrezka');
const notifications = require('./notifications');

router.use('/hdrezka', hdrezka);
router.use('/notifications', notifications);

// DOCS
router.use('/docs', swagger.serve);
router.get('/docs', setDocs(docs), swagger.setup(docs));

module.exports = router;
