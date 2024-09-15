const express = require('express');
const router = express.Router();
const { createRide, findRide } = require('../controllers/tripController');

router.post('/create', createRide);
router.post('/find', findRide);

module.exports = router;
