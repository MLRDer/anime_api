const router = require("express").Router();
const hdrezka = require("../controllers/hdrezka");

router.get("/id", hdrezka.getID);
router.get("/sources", hdrezka.getSources);
router.post("/imdb", hdrezka.getIMDbInfo);
router.patch("/available", hdrezka.getAllAvailableTranslators);

module.exports = router;
