const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const {OrderItem} = require("../models/order-item");
const {Order} = require("../models/order");


router.get(`/`, async (req, res) => {
	const orders = await Order.find()
		.populate('user', 'name')
		.sort({'orderDate': -1});

	if (!orders)
		return res.status(500).json({success: false})

	res.send(orders);
});


router.get(`/:id`, async (req, res) => {
	const order = await Order.findById(req.params.id)
		.populate('user', 'name')
		.populate({
			path: 'orderItems', populate: {
				path: 'product', populate: 'category'
			}
		});

	if (!order)
		return res.status(500).json({success: false})

	res.send(order);
});


router.put(`/:id`, async (req, res) => {
	const order = await Order.findByIdAndUpdate(
		req.params.id,
		{
			status: req.body.status
		},
		{new: true}
	)

	if (!order)
		return res.status(500).json({success: false})

	res.send(order);
});

router.post(`/`, async (req, res) => {
	const orderItemsIds = Promise.all(req.body.orderItems.map(async (orderItem) => {
		let newOrderItem = new OrderItem({
			quantity: orderItem.quantity,
			product: orderItem.product
		})

		newOrderItem = await newOrderItem.save();

		return newOrderItem._id;
	}))

	const orderItemsIdsResolved = await orderItemsIds;  // this line resolve promise into ids
	const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
		const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
		const price = orderItem.product.price * orderItem.quantity;
		return price;
	}))

	const totalPrice = totalPrices.reduce((a, b) => a + b, 0)

	let order = new Order({
		orderItems: orderItemsIdsResolved,
		shippingAddress1: req.body.shippingAddress1,
		shippingAddress2: req.body.shippingAddress2,
		city: req.body.city,
		zip: req.body.zip,
		country: req.body.country,
		phone: req.body.phone,
		status: req.body.status,
		totalPrice: totalPrice,
		user: req.body.user,
	})

	order = await order.save()

	if (!order)
		return res.status(400).send('The order cannot be created!');

	res.send(order);
});

router.delete('/:id', (req, res) => {
	Order.findByIdAndRemove(req.params.id).then(async order => {
		if (order) {
			await order.orderItems.map(async orderItem => {
				await OrderItem.findByIdAndRemove(orderItem);
			})
			return res.status(200).json({
				success: true,
				message: 'Order deleted'
			});
		} else {
			return res.status(404).json({
				success: false,
				message: 'Order not found'
			});
		}
	}).catch(error => {
		return res.status(400).json({
			success: false,
			error: error
		})
	})
});


// Count SalesAmount
router.get(`/get/totalsales`, async (req, res) => {
	const totalSales = await Order.aggregate([
		{$group: {_id: null, totalSales: {$sum: '$totalPrice'}}}
	])

	if (!totalSales)
		return res.status(400).send('Cant calculate total sales')

	res.send({totalSales: totalSales.pop().totalSales});
});

//Count Orders
router.get(`/get/count`, async (req, res) => {
	let orderCount = await Order.countDocuments((count) => count);
	if (!orderCount) return res.status(500).json({
		message: "No Orders Found!"
	})
	res.status(200).send({
		orderCount: orderCount
	});
});

//User Sepcific Order
router.get(`/userorders/:userId`, async (req, res) => {
	const userOrderList = await Order.find({user:req.params.userId})
		.populate({
			path: 'orderItems', populate: {
				path: 'product', populate: 'category'
			}
		}).sort({'orderDate':-1});

	if (!userOrderList)
		return res.status(500).json({success: false})

	res.send(userOrderList);
});


module.exports = router;