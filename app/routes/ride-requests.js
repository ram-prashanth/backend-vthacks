const express = require('express');
const router = express.Router();
const { requestRide, getRideStatus } = require('../controllers/rideRequestController');

router.post('/request', requestRide);
router.get('/status/:rideId', getRideStatus);

module.exports = router;
