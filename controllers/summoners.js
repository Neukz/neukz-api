const { LeagueOfLegendsAPI, TeamfightTacticsAPI } = require('../utils/axios');
const { regions } = require('../constants/riot/regions');
const { statsFields } = require('../constants/riot/responseFields');
const { queueTypes } = require('../constants/riot/queueTypes');

// Get summoner account data and League of Legends stats from Riot Games API
exports.getSummoner = async function (req, res, next) {
	const { region, summonerName } = req.params;

	// Check if region is valid and return corresponding routing value
	const platform = regions.find(r => r.abbreviation === region.toLowerCase());
	if (!platform) {
		return res.status(400).json({
			message: `Invalid region: ${region}`
		});
	}

	try {
		const encodedSummonerName = encodeURIComponent(summonerName);

		// Get summoner account data - the API returns different IDs per key
		const summoner = await Promise.all([
			LeagueOfLegendsAPI.get(
				`https://${platform.value}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${encodedSummonerName}`
			),
			TeamfightTacticsAPI.get(
				`https://${platform.value}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${encodedSummonerName}`
			)
		]);

		// Get appropriate IDs for LoL and TFT
		const { id: LoLId } = summoner[0].data;
		const { id: TFTId } = summoner[1].data;

		// Get summoner stats from both games simultaneously
		const stats = await Promise.all([
			LeagueOfLegendsAPI.get(
				`https://${platform.value}.api.riotgames.com/lol/league/v4/entries/by-summoner/${LoLId}`
			),
			TeamfightTacticsAPI.get(
				`https://${platform.value}.api.riotgames.com/tft/league/v1/entries/by-summoner/${TFTId}`
			)
		]);

		// Filter out inisignificant fields from stats response
		const filteredStats = stats.map(game => {
			return (
				game.data
					.map(stats => {
						const filteredQueue = {};
						statsFields.map(field => {
							filteredQueue[field] = stats[field];
						});
						return filteredQueue;
					})

					// Replace API response queueTypes with user-friendly names
					.map(stats => {
						stats.queueType = queueTypes[stats.queueType];
						return stats;
					})
			);
		});

		const [LoL, TFT] = filteredStats;

		// Bugfix: move RANKED_TFT_DOUBLE_UP from LoL stats to TFT stats
		// See: https://github.com/RiotGames/developer-relations/issues/572
		LoL.map((stats, index) => {
			if (stats.queueType === 'Ranked Teamfight Tactics (Double Up)') {
				TFT.push(stats);
				LoL.splice(index, 1);
			}
		});

		const response = { summoner: summoner[0].data, stats: { LoL, TFT } };
		res.status(200).json(response);
	} catch (error) {
		// Return API error response or Internal Server Error
		return res.status(error.response.status || 500).json({
			message:
				error.response.data.status.message ||
				'The server has encountered an error that it cannot handle'
		});
	}
};
