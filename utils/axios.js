// Axios instances for 3rd party APIs
const axios = require('axios');

// Riot Games API - League of Legends
exports.riotLOL = axios.create({
	headers: {
		'X-Riot-Token': process.env.LOL_TOKEN
	}
});

// Riot Games API - Teamfight Tactics
exports.riotTFT = axios.create({
	headers: {
		'X-Riot-Token': process.env.TFT_TOKEN
	}
});
