const express = require('express');
const router = express.Router();
require('dotenv/config');

const {User} = require('../models/user');
// this library is for hashing stuff
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.get(`/`, async (req, res) => {
	let userList = await User.find().select('-passwordHash');
		// .select('local.email local.username');
	if(!userList) return res.status(500).json("No User Found!")
	res.status(200)
		.send(userList);
});

router.get('/fetch', (req,res)=>{
	console.log("HI")
	res.status(200).send({
		message:"Hello"
	})
});

router.get(`/:id`, async (req, res) => {
	let user = await User.findById(req.params.id).select('-passwordHash');
	if(!user) return res.status(404).json("No User Found with this id!")
	res.status(200).send(user);
});


router.post(`/Register`, async (req, res) => {
	let userExist = await User.findOne({email:req.body.email});
	const secret = process.env.SECRET;
	if(userExist) {
		return res.status(400).send({
			code:605,
		})
	} 
	let data = [
		{name:"jahir"},{name:"jahir"},{name:"jahir"}
	]
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
		country: req.body.country,
		//shippingAddress: [{actual: `${req.body.apartment}, ${req.body.street}, ${req.body.city}, ${req.body.country}-${req.body.zip}` }]
		
	})
	console.log(user)
	// user = await user.save();

	// if (!user) {
	// 	return res.status(400).send({
	// 		code:601,
	// 	});
	// }
	// const token = jwt.sign(
	// 	{
	// 		userId:user._id,
	// 		email: user.email,
	// 		isAdmin:user.isAdmin
	// 	},
	// 	secret,
	// 	{
	// 		expiresIn: '1d'
	// 		// expiresIn: '180000'

	// 	}
	// )
	res.status(200).send({
		user:user
		// id:user._id,
		// name:user.name,
		// email:user.email,
		// token:token,
		// expiresIn: new Date(new Date().getTime() + 64764000 )  // 17.99 hours = 64764000 ms due to GMT+6
		// expiresIn:new Date(new Date().getTime() + 180000 )
	});

});


router.post('/login',async (req,res)=>{
	const user = await User.findOne({email:req.body.email})
	const secret = process.env.SECRET;
	if(!user) return res.status(400).send({
		code:606
	});
	if(user && bcrypt.compareSync(req.body.password,user.passwordHash))  {
		// access token
		const token = jwt.sign(
			{
				userId:user._id,
				email: user.email,
				isAdmin:user.isAdmin
			},
			secret,
			{
				expiresIn: '1d'
				// expiresIn: '180000'

			}
		)

		// refreshToken

		const refreshToken = jwt.sign(
			{
				userId:user._id,
				email: user.email,
				isAdmin:user.isAdmin
			},
			secret,
			{
				expiresIn: '1d'
				// expiresIn: '180000'

			}
		)

		res.status(200).send({
			id:user._id,
			name:user.name,
			email:user.email,
			token:token,
			refreshToken:refreshToken,
			expiresIn: new Date(new Date().getTime() + 64764000 )  // 17.99 hours = 64764000 ms due to GMT+6
			// expiresIn:new Date(new Date().getTime()+ 180000)

		});
	}
	else {
		res.status(400).send({
			code:607
		});
	}
})

router.put('/update/:id',async(req,res)=>{

	try{
		let user = await User.findById(req.params.id)
		if(!user){
			res.status(400).send({
				message: "no user found",
				success:false
			});
		}

		user.name = req.body.user.name ? req.body.user.name: user.name
		user.email = req.body.user.email ? req.body.user.email: user.email
		user.phone = req.body.user.phone ? req.body.user.phone: user.phone
		user.isAdmin = req.body.user.isAdmin ? req.body.user.isAdmin: user.isAdmin
		user.street = req.body.user.street ? req.body.user.street: user.street
		user.apartment = req.body.user.apartment ? req.body.user.apartment: user.apartment
		user.zip = req.body.user.zip ? req.body.user.zip: user.zip
		user.city = req.body.user.city ? req.body.user.city: user.city
		user.country = req.body.user.country ? req.body.user.country: user.country
		let shippingAddress = {current:true,actual: `${user.apartment}, ${user.street}, ${user.city}, ${user.country}-${user.zip}` }
		user.shippingAddress = [...user.shippingAddress,shippingAddress]

		let updatedUser = await user.save()
		if(!updatedUser){
			res.status(500).send({
				success:false,
				message:"User Address Update Failed"
			})
		}
		res.status(200).send({
			success:true,
			user:updatedUser
		})
	}
	catch(err){
		res.status(501).send({
			success:false,
			message:'Whole Process Failed',
			error: err
		})
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
