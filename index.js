const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');

// Load environment variables
require('dotenv').config({ path: './config/config.env' });

// Routes
const summoners = require('./routes/summoners');
const weathermann = require('./routes/weathermann');

// Initialize express
const app = express();

// Set security HTTP headers
app.use(helmet());

// Prevent XSS
app.use(xss());

// Mount routers
app.use('/api/summoners', summoners);
app.use('/api/weathermann', weathermann);

const port = process.env.PORT;

app.listen(
	port,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${port}`
	)
);
