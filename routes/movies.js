const router = require("express").Router();
const movie = require("../controllers/movies");

router.get("/", movie.getAll);
router.get("/search", movie.search);
router.get("/:id", movie.get);
router.post("/", movie.create);
router.patch("/:id", movie.update);
router.delete("/:id", movie.delete);

module.exports = router;
