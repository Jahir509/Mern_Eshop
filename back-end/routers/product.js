const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const {Category} = require('../models/category');
const mongoose = require('mongoose');
const { uploadImage } = require('../helpers/s3');
const escape = require('escape-regexp')
// Photo Uploading Library
const multer = require('multer');
const path = require('path');
const fs = require('fs');
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
		const uniqueSuffix = Math.round(Math.random() * 1E9);
		// const fileName = file.originalname.replace(' ','-');
		// const fileName = file.originalname.split(' ').join('-');
		const extension = fileTypeMap[file.mimetype];
		cb(null,`${uniqueSuffix}-${Date.now()}.${extension}`)
	}
})

const uploadOptions = multer({
	storage:storage
})


router.get(`/`, async (req, res) => {
	const page = +req.query.currentPage
	const itemsPerPage = 20;
	let filter = {};
	//for query params api/v1/products?categories=abcd,wxyz
	if (req.query.categories) {
		console.log(req.query.categories.split(','))
		filter = {category: req.query.categories.split(',')};
	}
	let productCount = await Product.countDocuments(filter).count(count=>count);

	if(!productCount) {
		if (!productCount) return res.status(500).send({
			message: "No Products Found!"
		})
	}


	let productList = await Product.find(filter)
						.populate('category')
						.skip((page-1)*itemsPerPage)
						.limit(itemsPerPage);

	if (!productList) return res.status(500).json("No Products Found!")

	res.status(200).send({
		productList: productList,
		totalProducts: productCount,
		// pagination
		hasNextPage: itemsPerPage * page < productCount,
		hasPreviousPage: page > 1,
		nextPage: page + 1,
		previousPage: page - 1 < 1 ? 1 : page - 1,
		lastPage: Math.ceil(productCount/itemsPerPage),
		firstPage:1,
		currentPage: page
	});
});

router.get('/search',async(req,res)=>{
	const page = +req.query.currentPage
	const searchParam = req.query.name;
	const itemsPerPage = 10;
	const str = escape(searchParam)

	let filter={
		"name":new RegExp(str, 'i')
	}

	let totalProducts = await Product.countDocuments(filter);
	if(!totalProducts) {
		return res.status(500).send({
			message: "No Products Found!"
		})
	}

	let products = await Product.find(filter)
						.skip((page-1)*itemsPerPage)
						.limit(itemsPerPage)
						.select('name');


	res.status(200).send({
		products: products,
		totalProducts: totalProducts,
		//pagination
		hasNextPage: itemsPerPage * page < totalProducts,
		hasPreviousPage: page > 1,
		nextPage: page + 1,
		previousPage: page - 1 < 1 ? 1 : page - 1,
		lastPage: Math.ceil(totalProducts/itemsPerPage),
		firstPage:1,
		currentPage: page
	}); 
	

});

router.get(`/:id`, async (req, res) => {

	let product = await Product.findById(req.params.id);
	if (!product) return res.status(404).json("No Product Found with this id!")
	res.status(200).send(product);
});

/*** when use multer use this middleware */
router.post(`/`,uploadOptions.single("image"),async (req, res) => {

	try{

		let category = await Category.findById(req.body.category);
		if (!category) return res.status(400).send('Invalid Category');

		// console.log(req.body);
		const file = req.file;
		if(!file) return res.status(400).send('No Image on Request');

		// const s3Result = await uploadImage(file);
		// if(!s3Result) return res.status(400).send('S3 error')
		// console.log(s3Result)

		const fileName = file.filename;
		const basePath = `${req.protocol}://${req.get('host')}/GIT/Mern_Eshop/public/uploads/`;

		let product = new Product({
			name: req.body.name,
			description: req.body.description,
			richDescription: req.body.richDescription,
			image: `${basePath}${fileName}`,
			// images: req.body.images,
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
	}
	catch(err){
		console.log(err);
		res.status(500).send({
			message:"Product Not Saveed",
			error: err
		})
	}
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

router.get('/category/:categoryId',async (req,res)=>{
	try{
		let category = req.params.categoryId;
		let products = await Product.find({
			category: mongoose.Types.ObjectId(category)
		})
		if(!products){
			return res.status(400).send({
				success:false,
				message:'No Data Found with this category'
			})
		}
		res.status(200).send({
			success:true,
			data: products
		})
	}catch (error){
		res.status(200).send(req.params.categoryId);
	}

})

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


router.post('/image-upload-gql',uploadOptions.single('image'),async (req,res)=>{
	try{
		const file = req.file;
		if(!file) return res.status(400).send('No Image on Request');
		if(req.body.oldPath){
			clearImage(req.body.oldPath)
		}
		res.status(200).send({filePath:req.file.filename,success:true})
	}catch(error){
		res.status(500).send({success:false,err:error})
	}
})


router.put('image-upload-gallery-gql',uploadOptions.array('images'),async (req,res)=>{

})




const clearImage = filePath=>{
	filePath = path.join((__dirname,'..',filePath))
	console.log(filePath)
	fs.unlink(filePath,err=> console.log(err))
}

module.exports = router;
