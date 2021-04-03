const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const {Category} = require('../models/category');


router.get(`/`, async (req, res) => {
	let productList = await Product.find().populate('category');
	if(!productList) return res.status(500).json("No Products Found!")
	res.status(200).send(productList);
});

router.get(`/:id`, async (req, res) => {
	let product = await Product.findById(req.params.id).populate('category');
	if(!product) return res.status(404).json("No Product Found with this id!")
	res.status(200).send(product);
});

router.post(`/`, async (req, res) => {

	let category = await Category.findById(req.body.category);
	if (!category) return res.status(400).send('Invalid Category');


	let product = new Product({
		name: req.body.name,
		description: req.body.description,
		richDescription: req.body.richDescription,
		image: req.body.image,
		images: req.body.images,
		brand: req.body.brand,
		price: req.body.price,
		category: req.body.category,
		countInStock: req.body.countInStock,
		rating: req.body.rating,
		numReviews: req.body.numReviews,
		isFeatured: req.body.isFeatured
	});

	product = await product.save();
	if (!product) return res.status(500).send('the product cannot be created!');

	res.status(200).send(product);
});

module.exports = router;