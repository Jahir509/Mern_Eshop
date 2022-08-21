const express = require('express');
const router = express.Router();
const axios = require('axios').default;

router.get('/bkash/token',async (req,res)=>{

    const options = {
        method: 'POST',
        url: 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/token/grant',
        headers: {
            Accept: 'application/json',
            username: process.env.BKASH_TEST_USERNAME,
            password: process.env.BKASH_TEST_PASSWORD,
            'Content-Type': 'application/json'
        },
        data: {
            app_key: process.env.BKASH_TEST_APP_KEY,
            app_secret: process.env.BKASH_TEST_APP_SECRET
        }
    };

    axios.request(options)
        .then(function (response) {
            // console.log(response.data);
            res.status(200).send(response.data)
        })
        .catch(function (error) {
            console.error(error);
            res.status(500).send(error)
        });
})

router.post('/bkash/pay',async (req,res)=>{
    const options = {
        method: 'POST',
        url: 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create',
        headers: {
            Accept: 'application/json',
            Authorization: req.headers.bkash_token,
            'X-APP-Key': process.env.BKASH_TEST_APP_KEY,
            'Content-Type': 'application/json'
        },
        data: {
            amount: '999',
            currency: 'BDT',
            intent: 'sale',
            merchantInvoiceNumber: generateInvoice()

        }
    };
    console.log(options.data);
    axios.request(options)
        .then(function (response) {
            //console.log(response.data);
            res.status(200).send(response.data)

        })
        .catch(function (error) {
            console.error(error);
            res.status(500).send('Payment not occured');
        });
})

router.get('/bkash/query',async (req,res)=>{


    const options = {
        method: 'GET',
        url: `https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/query/${req.query.payment_id}`,
        headers: {
            Accept: 'application/json',
            Authorization: req.headers.bkash_token,
            'X-APP-Key': process.env.BKASH_TEST_APP_KEY,
        }
    };

    axios
        .request(options)
        .then(function (response) {
            res.status(200).send(response.data);
        })
        .catch(function (error) {
            console.error(error);
            res.status(500).send(error);
        });
})

router.post('/bkash/execute',async (req,res)=>{

    const options = {
        method: 'POST',
        url: `https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/execute/${req.query.payment_id}`,
        headers: {
            Accept: 'application/json',
            Authorization: 'eyJraWQiOiJmalhJQmwxclFUXC9hM215MG9ScXpEdVZZWk5KXC9qRTNJOFBaeGZUY3hlamc9IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJiM2Q4OGVkZC0xNzc2LTRhMjEtYWZlMi0zN2FkZTk3NzEyZDMiLCJhdWQiOiI2NmEwdGZpYTZvc2tkYjRhMDRyY24wNjNhOSIsImV2ZW50X2lkIjoiNGY2MTA5NTQtMjQzYi00N2IyLThmZWUtNThmMGE2MDVmNzdkIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NjA4MzE0ODAsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC5hcC1zb3V0aGVhc3QtMS5hbWF6b25hd3MuY29tXC9hcC1zb3V0aGVhc3QtMV9rZjVCU05vUGUiLCJjb2duaXRvOnVzZXJuYW1lIjoic2FuZGJveFRlc3RVc2VyIiwiZXhwIjoxNjYwODM1MDgwLCJpYXQiOjE2NjA4MzE0ODB9.ZHd8rq2_fb5NqDpBEtHbPTOIoM8T_TvZlgZmum7LgcjCSBqKGijwGC53-DkFim3JNspAKj2BLaHKgUiuPJrwQvxU1IVTxhjuE7Qr2KgdZf97nB6ismqelsCZd_nX073Y7lvslJ7gusU0v6lAfEGfUL3_TMcvFhhQs2-BIfuYF7jzFJFYkJUsDon7ExgEIFsZRjPY1jZcmUosz9-HjGhg4cZtLNXCp49AtPotCaC8qEU_jRMugFRbBFx3UsxWYzIp2SmDNNdsWH9iM7gs84HHPHvmp7gPAI1UoGN1y0T1jltkAWeJDuqFspgXCVNmb0wbcrp45paRxnHCCuOqF1ULzw',
            'X-APP-Key': '5tunt4masn6pv2hnvte1sb5n3j'
        }
    };

    axios
        .request(options)
        .then(function (response) {
            res.status(200).send(response.data);
        })
        .catch(function (error) {
            console.error(error);
            res.status(500).send(error);
        });
})

router.post('/bkash/refund',async (req,res)=>{

})

function generateInvoice(){
    const number = Math.floor(100000 + Math.random() * 900000);
    return number.toString();
}

module.exports = router;
