const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const {User} = require('../models/user')

// function requiresLogin(req, res, next) {
//     if(!req.user){
//         return res.status(403).send('Not allowed');
//     }
//     next(null);
// }
//
//
//
// function authJwt(){
//     const secret = process.env.SECRET;
//     console.log(secret);
//
//     return async (req, res, next) => {
//         try {
//             if (req.headers.auth) {
//
//                 const payload = jwt.verify(req.headers.auth, secret);
//                 console.log(payload);
//                 if (payload) {
//                     req.user = await User.findOne({email: payload.email});
//                 }
//             }
//             next(null);
//         }
//         catch(err) {
//             next(err);
//         }
//     }
// }

function authJwt() {
	const secret = process.env.SECRET;
	const api = process.env.API_URL;
	return expressJwt({
		secret,
		algorithms: ['HS256'],
		isRevoked:isRevoked
	}).unless({
		path: [
			{ url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
			{ url: /\/api\/v1\/brands(.*)/, methods: ['GET', 'OPTIONS'] },
			{ url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
			{ url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
			`${api}/users`,
			`${api}/users/login`,
			`${api}/users/register` 
		]
	})
}

// Classify the user
async function isRevoked(req,payload,done){
	if(!payload.isAdmin) {
		done(null,true);
	}
	done();
}

module.exports = authJwt()
