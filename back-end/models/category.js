const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
	name: {type: String, required: true},
	icon: {type: String},
	color: {type: String},
	isParent: {type:Boolean, required: true},
	isChild: {type:Boolean, required: true},
	url: {type:String},
	parentCategory: {
		name: {type:String},
		id: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
	} 
	// image: {type: String, default: ''},
}); 

// this method is to convert "_id" of mongodb into "id" in frontend
categorySchema.virtual('id').get(function () {
	return this._id.toHexString();
});
// this method is for enabling virtual method
categorySchema.set('toJSON', {
	virtuals: true
});

exports.Category = mongoose.model('Category', categorySchema);
