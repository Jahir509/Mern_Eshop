const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const {Category} = require('../models/category');
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {

	let filter = {};
	//for query params api/v1/products?categories=abcd,wxyz
	if (req.query.categories) {
		filter = {category: req.query.categories.split(',')};
	}

	let productList = await Product.find(filter).populate('category');
	if (!productList) return res.status(500).json("No Products Found!")
	res.status(200).send(productList);
});

router.get(`/:id`, async (req, res) => {
	let product = await Product.findById(req.params.id).populate('category');
	if (!product) return res.status(404).json("No Product Found with this id!")
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

router.put('/:id', async (req, res) => {
	// this is for checking id validity
	if (!mongoose.isValidObjectId(req.params.id)) {
		res.status(400).send('Invalid product id');
	}

	let product = await Product.findByIdAndUpdate(
		req.params.id,
		{
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
		},
		{
			new: true
		});

	if (!product) return res.status(404).json("No Product Found with this id");
	res.status(200).send(product);

});

router.delete('/:id', (req, res) => {
	Product.findByIdAndRemove(req.params.id).then(product => {
		if (product) {
			return res.status(200).json({
				success: true,
				message: 'Product deleted'
			});
		} else {
			return res.status(404).json({
				success: false,
				message: 'Product not found'
			});
		}
	}).catch(error => {
		return res.status(400).json({
			success: false,
			error: error
		})
	})
});

//Count Products
router.get(`/get/count`, async (req, res) => {
	let productCount = await Product.countDocuments((count) => count);
	if (!productCount) return res.status(500).json({
		message: "No Products Found!"
	})
	res.status(200).send({
		productCount: productCount
	});
});

//Feature Products
router.get(`/get/featured`, async (req, res) => {
	let products = await Product.find({isFeatured: true});
	if (!products) return res.status(500).json({
		message: "No Products Found!"
	})
	res.send(products);
});

module.exports = router;
