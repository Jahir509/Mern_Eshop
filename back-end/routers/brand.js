const {Brand} = require('../models/brands');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get(`/`, async (req, res) => {
	let brandList = await Brand.find().skip().limit(12);
	if(!brandList) return res.status(500).json("No Brand Found!")
	res.status(200).send(brandList);
});

router.get(`/:id`, async (req, res) => {
	let brand = await Brand.findById(req.params.id);
	if(!brand) return res.status(404).json("No Brand Found with this id!")
	res.status(200).send(brand);
});

router.put(`/:id`, async (req, res) => {
	// this is for checking id validity
	if(!mongoose.isValidObjectId(req.params.id)){
		res.status(400).send('Invalid brand id');
	}


	let brand = await Brand.findByIdAndUpdate(
		req.params.id,
		{
			name:req.body.name,
			image:req.body.image,
			popularity:req.body.popularity,
			rating:req.body.rating,
			ratingCount: req.body.ratingCount,
			reviews: req.body.reviews,
		},
		{
			new:true
		});
	if(!brand) return res.status(404).json("No Brand Found with this id!")
	res.status(200).send(brand);
});

router.post(`/`, async (req, res) => {
	let brand = new Brand({
		name:req.body.name,
        image:req.body.image,
        popularity:req.body.popularity,
        rating:req.body.rating,
        ratingCount: req.body.ratingCount,
        reviews: req.body.reviews,
	});
	brand = await brand.save();

	if(!brand) return res.status(400).send('the brand cannot be updated!')

	res.send(brand);
});

router.delete('/:id',(req,res)=>{
	Brand.findByIdAndRemove(req.params.id).then(brand=>{
		if(brand){
			return res.status(200).json({
				success:true,
				message:'Brand deleted'
			});
		} else{
			return res.status(404).json({
				success:false,
				message:'Brand not found'
			});
		}
	}).catch(error=>{
		return res.status(400).json({
			success:false,
			error:error
		})
	})
});

router.get(`/get/count`, async (req, res) => {
	let brandCount = await Brand.countDocuments((count)=> count);
	if(!brandCount) return res.status(500).json({
		message:"No Products Found!"
	})
	res.status(200).send({
		brandCount:brandCount
	});
});
module.exports = router;