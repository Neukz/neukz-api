const express = require('express');
const cors = require('cors');
const { getWeather } = require('../controllers/weather');

const router = express.Router();

router.use(cors({ origin: process.env.WEATHERMANN_ORIGIN }));

router.route('/weather').get(getWeather);

module.exports = router;
