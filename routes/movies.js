const router = require('express').Router();
const movie = require('../controllers/movies');

router.get('/', movie.getAll);
router.get('/search', movie.search);
router.get('/:id', movie.get);
router.post('/', movie.create);
router.patch('/:id', movie.update);
router.delete('/:id', movie.delete);
router.get('/tmdb/:id', movie.getByTmdbId);

module.exports = router;
