const express = require('express');
const api = process.env.API_URL;

// Routers variable
const productRouter = require('../routers/product')
const orderRouter = require('../routers/order')
const categoryRouter = require('../routers/category')
const userRouter = require('../routers/user')

//routers
module.exports = function(app){
    app.use(express.json());
    app.use(`${api}/products`,productRouter);
    app.use(`${api}/categories`,categoryRouter);
    app.use(`${api}/orders`,orderRouter);
    app.use(`${api}/users`,userRouter);
}
