const router = require("express").Router();
const actor = require("../controllers/actors");

router.get("/", actor.getAll);
router.get("/movies/:id", actor.findMovies);
router.get("/:id", actor.get);
router.post("/", actor.create);
router.patch("/:id", actor.update);
router.delete("/:id", actor.delete);

module.exports = router;
