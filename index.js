const express = require('express');

// Load environment variables
require('dotenv').config({ path: './config/config.env' });
console.log(process.env.PORT);
// Initialize express
const app = express();

const port = process.env.PORT || 5000;

app.listen(
	port,
	console.log(
		`Server is running in ${process.env.NODE_ENV} mode on port ${port}`
	)
);
