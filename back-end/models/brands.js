const mongoose = require('mongoose')

const brandSchema = mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String, default: ''},
    popularity: {type: Number, default: 0},
    rating: {type: Number, default: 0},
    ratingCount: {type: Number, default: 0},
    reviews: {
        type: [
            {
                name: {type:String},
                comment: {type:String}
            }
        ],
        default:[]
    }
})

// this method is to convert "_id" of mongodb into "id" in frontend
brandSchema.virtual('id').get(function () {
	return this._id.toHexString();
});
// this method is for enabling virtual method
brandSchema.set('toJSON', {
	virtuals: true
});

exports.Brand = mongoose.model('Brand', brandSchema);