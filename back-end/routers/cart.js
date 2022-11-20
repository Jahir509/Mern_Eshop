const {Cart} = require('../models/cart');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');


router.get(`/create`, async (req, res) => {
	let cartId = Math.floor(Math.random()*999999)
	let cart = new Cart()
	cart.cartId = cartId
	let freshCart = await cart.save()
	if(!freshCart) return res.status(500).json("Cart Creation failed!!!")
	res.status(200).send(freshCart);
});

router.get(`/`, async (req, res) => {
	let cartList = await Cart.find();
	if(!cartList) return res.status(500).json("No Cart Found!")
	res.status(200).send(cartList);
});

router.get(`/:id`, async (req, res) => {
	let cart = await Cart.findById(req.params.id);
	if(!cart) return res.status(404).json("No Cart Found with this id!")
	res.status(200).send(cart);
});

router.put(`/:cartId`, async (req, res) => {
	let cartId = req.params.cartId
	let cart = await Cart.findOne({cartId:cartId})
	if(cart.cartItems.find(x=>x.productId === req.body.product.productId)){
		return res.status(200).send({
			success:false,
			message:"Item already added in cart",
			cart:cart
		})
	}
	cart.cartItems.push(req.body.product)
	let updatedCart = await cart.save()
	res.status(200).send({
		success:true,
		cart:updatedCart,
	})
	
});

router.post(`/`, async (req, res) => {
	let cart = new Cart({
		username:req.body.username,
		userid:req.body.userid,
		address:req.body.address,
		cartItems:req.body.cartItems,
	});
	cart = await cart.save();

	if(!cart) return res.status(400).send('the cart cannot be updated!')

	res.send(cart);
});

router.delete('/:id',(req,res)=>{
	Cart.findByIdAndRemove(req.params.id).then(cart=>{
		if(cart){
			return res.status(200).json({
				success:true,
				message:'Cart deleted'
			});
		} else{
			return res.status(404).json({
				success:false,
				message:'Cart not found'
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
	let cartCount = await Cart.countDocuments((count)=> count);
	if(!cartCount) return res.status(500).json({
		message:"No Products Found!"
	})
	res.status(200).send({
		cartCount:cartCount
	});
});
module.exports = router;