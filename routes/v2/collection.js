const router = require('express').Router();
const collection = require('../../controllers/v2/collection');

router.get('/', collection.getAll);
router.get('/:id', collection.get);
router.post('/', collection.create);
router.patch('/:id', collection.update);
router.delete('/:id', collection.delete);

router.get('/:id/media', collection.push);

module.exports = router;
