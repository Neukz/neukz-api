const { LeagueOfLegendsAPI, TeamfightTacticsAPI } = require('../utils/axios');
const { regions } = require('../constants/riotRegions');
const {
	summonerFields,
	statsFields
} = require('../constants/riotResponseFields');

// Get summoner account data and League of Legends stats from Riot Games API
exports.getSummoner = async function (req, res, next) {
	const { region, summonerName } = req.params;

	// Check if region is valid and return corresponding routing value
	const platform = regions.find(r => r.abbreviation === region.toLowerCase());

	// Get summoner account data
	const summoner = await LeagueOfLegendsAPI.get(
		`https://${platform.value}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}`
	);

	// Get summoner stats from both games simultaneously
	const stats = await Promise.all([
		LeagueOfLegendsAPI.get(
			`https://${platform.value}.api.riotgames.com/lol/league/v4/entries/by-summoner/${summoner.data.id}`
		),
		TeamfightTacticsAPI.get(
			`https://${platform.value}.api.riotgames.com/tft/league/v1/entries/by-summoner/${summoner.data.id}`
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

	const [LoL, TFT] = filteredStats;
	const response = { summoner: filteredSummoner, stats: { LoL, TFT } };
	res.status(200).json(response);
};
