const router = require("express").Router();
const update = require("../controllers/update");

router.get("/", update.getAll);
router.get("/:id", update.get);
router.post("/", update.create);
router.patch("/:id", update.update);
router.delete("/:id", update.delete);

module.exports = router;
