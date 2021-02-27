const router = require('express').Router();
const category = require('../../controllers/v2/categories');

router.get('/', category.getAll);
router.get('/:id', category.get);
router.post('/', category.create);
router.patch('/:id', category.update);
router.delete('/:id', category.delete);

module.exports = router;
