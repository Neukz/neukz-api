const { LeagueOfLegendsAPI } = require('../utils/axios');

// Get summoner account data and League of Legends stats from Riot Games API
exports.getSummoner = async function (req, res, next) {
	const { region, summonerName } = req.params;

	const summoner = await LeagueOfLegendsAPI.get(
		`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`
	);

	const stats = await LeagueOfLegendsAPI.get(
		`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.data.id}`
	);

	const response = { summoner: summoner.data, stats: stats.data };
	res.status(200).json(response);
};
