const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');
const api = process.env.API_URL;
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');


// variable & Models & modules



// // Middleware
// app.use(cors);
// app.options('*',cors());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
	  "Access-Control-Allow-Headers",
	  "Origin,X-Requested-With,Content-Type,Accept"
	);
	res.setHeader(
	  "Access-Control-Allow-Methods",
	  "GET,POST,PUT,PATCH,DELETE,OPTIONS"
	);
	next();
  });

app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(authJwt);
app.use('/GIT/Mern_Eshop/public/uploads',express.static(  'G:/GIT/Mern_Eshop/public/uploads'));
app.use(errorHandler);

//routes
require('./startup/routes')(app);

//Database
require('./startup/db')();

app.listen(3000, () => {
	console.log("Server is running");
	console.log(api);
});
