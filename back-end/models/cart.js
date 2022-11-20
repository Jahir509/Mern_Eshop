const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
	cartId: {type: String},
    username: {type: String},
	userid: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	address: {type: String},
	cartItems: [
        {
            productName: {type:String},
            brand: {type:String},
            price: {type:Number},
            quantity: {type:Number},
            productId: {type:String},
            image: {type:String},
        }
    ]
	// image: {type: String, default: ''},
    },
    { timestamps: true }
); 

// this method is to convert "_id" of mongodb into "id" in frontend
cartSchema.virtual('id').get(function () {
	return this._id.toHexString();
});
// this method is for enabling virtual method
cartSchema.set('toJSON', {
	virtuals: true
});

exports.Cart = mongoose.model('Cart', cartSchema);