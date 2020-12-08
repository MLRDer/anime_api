const router = require("express").Router();
const uploads = require("../controllers/uploads");

router.get("/", uploads.getUrl);

module.exports = router;
