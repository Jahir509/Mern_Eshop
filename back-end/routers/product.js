const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const {Category} = require('../models/category');
const mongoose = require('mongoose');
// Photo Uploading Library
const multer = require('multer');
const fileTypeMap = {
	'image/png' : 'png',
	'image/jpeg' : 'jpeg',
	'image/jpg' : 'jpg'
}
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		const isValid = fileTypeMap[file.mimetype];
		let uploadError = new Error('Invalid Image Type');
		if(isValid){
			uploadError = null
		}
		cb(uploadError, '/GIT/Mern_Eshop/public/uploads/')
	},
	filename: function (req, file, cb) {
		// const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
		// const fileName = file.originalname.replace(' ','-');
		const fileName = file.originalname.split(' ').join('-');
		const extension = fileTypeMap[file.mimetype];
		cb(null,`${fileName}-${Date.now()}.${extension}`)
	}
})

const uploadOptions = multer({
	storage:storage
})


router.get(`/`, async (req, res) => {
	let filter = {};
	//for query params api/v1/products?categories=abcd,wxyz
	if (req.query.categories) {
		filter = {category: req.query.categories.split(',')};
	}

	let productList = await Product.find(filter).limit(50);
	if (!productList) return res.status(500).json("No Products Found!")
	res.status(200).send(productList);
});

router.get(`/:id`, async (req, res) => {

	let product = await Product.findById(req.params.id);
	if (!product) return res.status(404).json("No Product Found with this id!")
	res.status(200).send(product);
});

router.post(`/`, uploadOptions.single('image') ,async (req, res) => {
	let category = await Category.findById(req.body.category);
	if (!category) return res.status(400).send('Invalid Category');

	const file = req.file;
	if(!file) return res.status(400).send('No Image on Request');

	const fileName = file.filename;
	const basePath = `${req.protocol}://${req.get('host')}/GIT/Mern_Eshop/public/uploads/`;

	let product = new Product({
		name: req.body.name,
		description: req.body.description,
		richDescription: req.body.richDescription,
		image: `${basePath}${fileName}`,
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

router.get(`/get/featured/:count`, async (req, res) => {
	const count = req.params.count ? req.params.count : 0;
	let products = await Product.find({isFeatured: true}).limit(+count);
	if (!products) return res.status(500).json({
		message: "No Products Found!"
	})
	res.send(products);
});


router.put(
	'/gallery-images/:id',
	uploadOptions.array('images'),
	async (req, res)=> {
		if(!mongoose.isValidObjectId(req.params.id)) {
			return res.status(400).send('Invalid Product Id')
		}
		const files = req.files;
		let imagesPaths = [];
		const basePath = `${req.protocol}://${req.get('host')}/GIT/Mern_Eshop/public/uploads/`;

		if(files) {
			files.map(file =>{
				imagesPaths.push(`${basePath}${file.filename}`);
			})
		}

		const product = await Product.findByIdAndUpdate(
			req.params.id,
			{
				images: imagesPaths
			},
			{ new: true}
		)

		if(!product)
			return res.status(500).send('the gallery cannot be updated!')

		res.send(product);
	}
)


module.exports = router;
