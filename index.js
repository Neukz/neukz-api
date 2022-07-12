const express = require('express');

// Load environment variables
require('dotenv').config({ path: './config/config.env' });

// Routes
const summoners = require('./routes/summoners');

// Initialize express
const app = express();

// Mount routers
app.use('/api/summoners', summoners);

const port = process.env.PORT;

app.listen(
	port,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${port}`
	)
);
