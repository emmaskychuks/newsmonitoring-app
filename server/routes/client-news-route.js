// import dependencies and initialize the express router
const express = require('express');
const ClientNewsController = require('../controllers/client-news-controller');

const router = express.Router();

// define routes
router.get('', ClientNewsController.getClientsNewsEndpoint);
router.get('/getClientNewsById', ClientNewsController.getClientNewsEndpointById);
router.post('', ClientNewsController.saveClientNewsEndpoint);

module.exports = router;