const express = require('express');
const router = express.Router();
const Product = require('../models/product');


router.get(`/`, (req, res) => {
	let products = [
		{
			id: 1,
			name: 'shoe',
			image: 'url',
		},
		{
			id: 2,
			name: 'shirt',
			image: 'url',
		},
		{
			id: 3,
			name: 'trouser',
			image: 'url',
		},
	]
	res.send(products);
});
router.post(`/`, (req, res) => {
	const newProduct = req.body;
	console.log(newProduct);
	res.send(newProduct);
});

module.exports = router;