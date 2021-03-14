const router = require('express').Router();
const notifications = require('../../controllers/v3/notifications');

router.post('/send', notifications.send);
router.post('/subscribe', notifications.subscribe);

module.exports = router;
