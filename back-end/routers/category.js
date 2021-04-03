const {Category} = require('../models/category');
const express = require('express');
const router = express.Router();


router.get(`/`, async (req, res) => {
	let categoryList = await Category.find();
	if(!categoryList) return res.status(500).json("No Category Found!")
	res.status(200).send(categoryList);
});

router.get(`/:id`, async (req, res) => {
	let category = await Category.findById(req.params.id);
	if(!category) return res.status(404).json("No Category Found with this id!")
	res.status(200).send(category);
});


router.put(`/:id`, async (req, res) => {
	let category = await Category.findByIdAndUpdate(
		req.params.id,
		{
			name:req.body.name,
			icon:req.body.icon,
			color:req.body.color
		},
		{
			new:true
		});
	if(!category) return res.status(404).json("No Category Found with this id!")
	res.status(200).send(category);
});


router.post(`/`, async (req, res) => {
	let category = new Category({
		name:req.body.name,
		icon:req.body.icon,
		color:req.body.color
	});
	category = await category.save();

	if(!category) return res.status(400).send('the category cannot be updated!')

	res.send(category);
});

router.delete('/:id',(req,res)=>{
	Category.findByIdAndRemove(req.params.id).then(category=>{
		if(category){
			return res.status(200).json({
				success:true,
				message:'Category deleted'
			});
		} else{
			return res.status(404).json({
				success:false,
				message:'Category not found'
			});
		}
	}).catch(error=>{
		return res.status(400).json({
			success:false,
			error:error
		})
	})
});

module.exports = router;