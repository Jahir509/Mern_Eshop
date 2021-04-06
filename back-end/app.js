const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');
const api = process.env.API_URL;
// const cors = require('cors');


// variable & Models & modules

// Routers variable
const productRouter = require('./routers/product')
const orderRouter = require('./routers/order')
const categoryRouter = require('./routers/category')
const userRouter = require('./routers/user')

// Middleware
// app.use(cors);
// app.options('*',cors());

app.use(bodyParser.json());
app.use(morgan('tiny'));
//routers
app.use(`${api}/products`,productRouter);
app.use(`${api}/categories`,categoryRouter);
//app.use(`${api}/orders`,orderRouter);
app.use(`${api}/users`,userRouter);







//Database
mongoose.connect(process.env.CONNECTION_STRING, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	dbName: 'eshop-database'
})
	.then(() => {
		console.log('Database Connection is ready...')
	})
	.catch((err) => {
		console.log(err);
	})

app.listen(3000, () => {
	console.log("Server is running");
	console.log(api);
});