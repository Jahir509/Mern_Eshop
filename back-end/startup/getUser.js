const User = require('../models/user').User;

module.exports = (req,res,next)=>{
    if (!req.headers.id) {
        return next();
      }
    User.findById(req.headers.id).select('_id')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => console.log(err));
}