const router = require("express").Router();
const anime = require("../controllers/animes");

router.get("/", anime.getAll);
router.get("/:id", anime.get);
router.post("/", anime.create);
router.post("/addSeries/:id", anime.addSeries);
router.post("/deleteSeries/:id/:seriesId", anime.deleteSeries);
router.patch("/:id", anime.update);
router.delete("/:id", anime.delete);

module.exports = router;
