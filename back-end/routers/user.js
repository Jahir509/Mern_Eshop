const express = require('express');
const router = express.Router();
const {User} = require('../models/user');


// router.get(`/`, (req, res) => {
// 	let user = [
// 		{
// 			id: 1,
// 			name: 'shoe',
// 			image: 'url',
// 		},
// 		{
// 			id: 2,
// 			name: 'shirt',
// 			image: 'url',
// 		},
// 		{
// 			id: 3,
// 			name: 'trouser',
// 			image: 'url',
// 		},
// 	]
// 	res.send(products);
// });
router.post(`/`, async (req, res) => {
	let user = new User({
		name: req.body.name,
		email: req.body.email,
		passwordHash: req.body.passwordHash,
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

module.exports = router;