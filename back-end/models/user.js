const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {type:String,required:true},
	email: {type:String,required:true},
	passwordHash: {type:String,required:true},
	phone: {type:String,required:true},
	isAdmin: {type:Boolean,default:false},
	street: {type:String,default:''},
	apartment: {type:String,default:''},
	zip: {type:String,default:''},
	city: {type:String,default:''},
	country: {type:String,default:''}
});

// this method is to convert "_id" of mongodb into "id" in frontend
productSchema.virtual('id').get(function () {
	return this._id.toHexString();
});
// this method is for enabling virtual method
productSchema.set('toJSON', {
	virtuals: true
});

exports.User = mongoose.model('User', userSchema);
exports.userSchema = userSchema;
