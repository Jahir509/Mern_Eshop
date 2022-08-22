const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv/config');
const api = process.env.API_URL;
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const mongoose = require("mongoose");
const getUser = require("./startup/getUser");

// variable & Models & modules


// // Middleware
app.use(cors());
// app.options('*',cors());


app.use(bodyParser.json());
app.use(morgan('tiny'));
// app.use(authJwt);
app.use('/GIT/Mern_Eshop/public/uploads',express.static(  'G:/GIT/Mern_Eshop/public/uploads'));
app.use(errorHandler);


app.use(getUser);
//routes
require('./startup/routes')(app);
// Redis Implementation
require('./services/cache');
//Database
require('./startup/db')();




app.listen(3000, () => {
	console.log("Server is running");
	console.log(api);
});
