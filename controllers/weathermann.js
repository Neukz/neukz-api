const { OpenWeatherMapAPI } = require('../utils/axios');

// Get weather data from OpenWeatherMap API
exports.getWeather = async function (req, res, next) {
	const { lat, lon } = req.query;

	// Request for metric units by default or imperial units if specified
	const units = req.query.units === 'imperial' ? req.query.units : 'metric';

	try {
		// Get current weather, air pollution and 5 day forecast simultaneously
		const weather = await Promise.all([
			OpenWeatherMapAPI.get('/weather', {
				params: {
					lat,
					lon,
					units
				}
			}),
			OpenWeatherMapAPI.get('/air_pollution', {
				params: {
					lat,
					lon
				}
			}),
			OpenWeatherMapAPI.get('/forecast', {
				params: {
					lat,
					lon,
					units
				}
			})
		]);

		res.status(200).json({
			current: weather[0].data,
			air: weather[1].data,
			forecast: weather[2].data
		});
	} catch (error) {
		// Return API error response or Internal Server Error
		return res.status(error.response.status || 500).json({
			message:
				error.response.data.message ||
				'The server has encountered an error that it cannot handle'
		});
	}
};
