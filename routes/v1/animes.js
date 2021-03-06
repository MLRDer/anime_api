const router = require('express').Router();
const anime = require('../../controllers/v1/animes');

router.get('/search', anime.search);
router.get('/home', anime.card);
router.post('/hdsearch', anime.movieCreate);
router.post('/hdsources', anime.getSources);
router.get('/imdb', anime.imdb);
router.get('/hdMultiple', anime.hdMultiple);

router.get('/', anime.getAll);
router.get('/:id', anime.get);
router.post('/', anime.create);
router.patch('/:id', anime.update);
router.delete('/:id', anime.delete);

router.get('/:id/episodes', anime.getEpisodes);
router.post('/:id/episodes', anime.addEpisode);
router.patch('/:id/episodes/:episodeId', anime.updateEpisode);
router.delete('/:id/episodes/:episodeId', anime.deleteEpisode);

module.exports = router;
