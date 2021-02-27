const router = require('express').Router();
const actor = require('../../controllers/v2/actors');

router.get('/', actor.getAll);
router.get('/:id/movies', actor.movies);
router.get('/search', actor.search);
router.get('/:id', actor.get);
router.post('/', actor.create);
router.patch('/:id', actor.update);
router.delete('/:id', actor.delete);

module.exports = router;
