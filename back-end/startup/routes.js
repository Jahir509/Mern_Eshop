const express = require('express');
const api = process.env.API_URL;

// Routers variable
const productRouter = require('../routers/product')
const orderRouter = require('../routers/order')
const categoryRouter = require('../routers/category')
const userRouter = require('../routers/user')
const paymentRouter = require('../routers/payment')
const uploadRouter = require('../routers/upload')
const brandRouter = require('../routers/brand')
const cartRouter = require('../routers/cart')


//routers
module.exports = function(app){
    app.use(express.json());
    app.use(`${api}/payment`,paymentRouter);
    app.use(`${api}/products`,productRouter);
    app.use(`${api}/upload`,uploadRouter);
    app.use(`${api}/categories`,categoryRouter);
    app.use(`${api}/orders`,orderRouter);
    app.use(`${api}/users`,userRouter);
    app.use(`${api}/brands`,brandRouter);
    app.use(`${api}/cart`,cartRouter);


}
