const router = require("express").Router();
const error = require("../controllers/errors");

router.get("/", error.getAll);
router.get("/:id", error.get);
router.post("/", error.create);
router.patch("/:id", error.update);
router.delete("/:id", error.delete);

module.exports = router;
