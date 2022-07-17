const { LeagueOfLegendsAPI, TeamfightTacticsAPI } = require('../utils/axios');
const {
	summonerFields,
	statsFields
} = require('../constants/riotResponseFields');

// Get summoner account data and League of Legends stats from Riot Games API
exports.getSummoner = async function (req, res, next) {
	const { region, summonerName } = req.params;

	// Get summoner account data
	const summoner = await LeagueOfLegendsAPI.get(
		`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`
	);

	// Get summoner stats from both games simultaneously
	const stats = await Promise.all([
		LeagueOfLegendsAPI.get(
			`https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.data.id}`
		),
		TeamfightTacticsAPI.get(
			`https://${region}.api.riotgames.com/tft/league/v1/entries/by-summoner/${summoner.data.id}`
		)
	]);

	// Filter out inisignificant fields from summoner object
	const filteredSummoner = {};
	summonerFields.map(field => {
		filteredSummoner[field] = summoner.data[field];
	});

	// Filter out inisignificant fields from stats response
	const filteredStats = stats.map(game => {
		return game.data.map(stats => {
			const filteredQueue = {};
			statsFields.map(field => {
				filteredQueue[field] = stats[field];
			});
			return filteredQueue;
		});
	});

	const [LOL, TFT] = filteredStats;
	const response = { summoner: filteredSummoner, stats: { LOL, TFT } };
	res.status(200).json(response);
};
