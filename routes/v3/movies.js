const router = require('express').Router();
const movie = require('../../controllers/v2/movies');
const movieV3 = require('../../controllers/v3/movies');

router.post('/sources', movieV3.sources);

router.get('/search', movie.search);
router.get('/home', movie.card);

router.get('/', movie.getAll);
router.get('/:id', movie.get);
router.post('/', movie.create);
router.patch('/:id', movie.update);
router.delete('/:id', movie.delete);

router.get('/:id/episodes', movie.getEpisodes);
router.post('/:id/episodes', movie.addEpisode);
router.patch('/:id/episodes/:episodeId', movie.updateEpisode);
router.delete('/:id/episodes/:episodeId', movie.deleteEpisode);

router.post('/:id/actors/tmdb', movie.addTMDBActors);

module.exports = router;
