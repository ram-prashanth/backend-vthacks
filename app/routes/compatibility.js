const express = require('express');
const router = express.Router();
const { getCompatibility } = require('../controllers/compatibilityController');

router.post('/get-compatibility-scores', getCompatibility);


module.exports = router;




