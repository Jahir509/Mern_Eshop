const jwt = require('jsonwebtoken');
const {User} = require('../models/user')

function requiresLogin(req, res, next) {
    if(!req.user){
        return res.status(403).send('Not allowed');
    }
    next(null);
}



function authJwt(){
    const secret = process.env.SECRET;
    console.log(secret);

    return async (req, res, next) => {
        try {
            if (req.headers.auth) {

                const payload = jwt.verify(req.headers.auth, secret);
                console.log(payload);
                if (payload) {
                    req.user = await User.findOne({email: payload.email});
                }
            }
            next(null);
        }
        catch(err) {
            next(err);
        }
    }
}

module.exports = {
    requiresLogin,
    authJwt,
};
