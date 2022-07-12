const express = require('express');
const cors = require('cors');
const { getSummoner } = require('../controllers/summoners');

const router = express.Router();

router.use(
	'/:region/:summonerName',
	cors({ origin: process.env.SUMMONERS_ORIGIN })
);

router.route('/:region/:summonerName').get(getSummoner);

module.exports = router;
