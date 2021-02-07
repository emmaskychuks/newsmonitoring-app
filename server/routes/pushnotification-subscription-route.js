const express = require('express');
const PushNotificationController = require('../controllers/pushnotification-subscription-controller');

const router = express.Router();

router.post('', PushNotificationController.subscribeToPushNotification)

module.exports = router;