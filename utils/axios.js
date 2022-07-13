// Axios instances for 3rd party APIs
const axios = require('axios');

// Riot Games API - League of Legends
exports.LeagueOfLegendsAPI = axios.create({
	headers: {
		'X-Riot-Token': process.env.LOL_TOKEN
	}
});

// Riot Games API - Teamfight Tactics
exports.TeamfightTacticsAPI = axios.create({
	headers: {
		'X-Riot-Token': process.env.TFT_TOKEN
	}
});
