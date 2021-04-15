const express = require('express');
const router = express.Router();
require('dotenv/config');

const {User} = require('../models/user');
// this library is for hashing stuff
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
	let userList = await User.find().select('name email phone');
	if(!userList) return res.status(500).json("No User Found!")
	res.status(200).send(userList);
});

router.get(`/:id`, async (req, res) => {
	let user = await User.findById(req.params.id).select('-passwordHash');
	if(!user) return res.status(404).json("No User Found with this id!")
	res.status(200).send(user);
});


router.post(`/Register`, async (req, res) => {
	let user = new User({
		name: req.body.name,
		email: req.body.email,
		passwordHash: bcrypt.hashSync(req.body.password,10),
		phone: req.body.phone,
		isAdmin: req.body.isAdmin,
		street: req.body.street,
		apartment: req.body.apartment,
		zip: req.body.zip,
		city: req.body.city,
		country: req.body.country
	})

	user = await user.save();

	if (!user) {
		return res.status(400).send('The user can\'t be created!');
	}
	res.send(user);

});


router.post('/login',async (req,res)=>{
	console.log("Called here");
	const user = await User.findOne({email:req.body.email})
	// console.log(user);
	 const secret = process.env.SECRET;
	console.log(secret);
	if(!user) return res.status(400).send('The user not found');
	if(user && bcrypt.compareSync(req.body.password,user.passwordHash))  {
		const token = jwt.sign(
			{
				userId:user.id,
				email: user.email,
				isAdmin:user.isAdmin
			},
			secret,
			{
				expiresIn: '1d'
			}
		)
		res.status(200).send({
			user:user.email,
			token:token
		});
	}
	else {
		res.status(400).send('Password not matched');
	}
})

//Count Users
router.get(`/get/count`, async (req, res) => {
	let userCount = await User.countDocuments((count) => count);
	if (!userCount) return res.status(500).json({
		message: "No User Found!"
	})
	res.status(200).send({
		userCount: userCount
	});
});

router.delete('/:id', (req, res) => {
	User.findByIdAndRemove(req.params.id).then(user => {
		if (user) {
			return res.status(200).json({
				success: true,
				message: 'User deleted'
			});
		} else {
			return res.status(404).json({
				success: false,
				message: 'User not found'
			});
		}
	}).catch(error => {
		return res.status(400).json({
			success: false,
			error: error
		})
	})
});

module.exports = router;
