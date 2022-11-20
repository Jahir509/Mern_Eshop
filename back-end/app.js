const express = require('express');
const path = require("path")
const app = express();
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
const morgan = require('morgan');
require('dotenv/config');
const api = process.env.API_URL;
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const mongoose = require("mongoose");
const getUser = require("./startup/getUser");
const {graphqlHTTP} = require("express-graphql");
const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolvers');
const graphqlAuth = require("./helpers/auth-graphql");
const authGraphql = require('./helpers/auth-graphql');
// variable & Models & modules


// // Middleware
app.use(cors());
// app.options('*',cors());


app.use(bodyParser.json());
app.use(cookieParser())
app.use(morgan('tiny'));
// app.use(authJwt);
app.use('/GIT/Mern_Eshop/public/uploads',express.static(  path.join('/GIT/Mern_Eshop/public/uploads')));
app.use(errorHandler);


app.use(getUser);
//routes
require('./startup/routes')(app);
// Redis Implementation
//require('./services/redis');
//Database
require('./startup/db')();


// app.use(authGraphql);
//
// app.use("/graphql",graphqlHTTP({
// 	schema:graphqlSchema,
// 	rootValue: graphqlResolver,
// 	graphiql:true,
// 	formatError(err){
// 		if(!err.originalError){
// 			return err;
// 		}
// 		const data = err.originalError.data;
// 		const message = err.message || "An error occurred.";
// 		const code = err.originalError.code || 500;
// 		return { message: message, status: code, data: data };
// 	}
// }))

app.listen(3000, () => {
	console.log("Server is running 3000");
	console.log(api);
});
