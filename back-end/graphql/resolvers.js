const {Product} = require('../models/product')
const {User} = require('../models/user')
const bcrypt = require('bcryptjs')
const validator = require('validator')

module.exports = {
    createProduct: async function({productInput},req){
        const product = new Product({
            name: productInput.name,
            description: productInput.description,
            image: productInput.image,
            price: productInput.price,
            category: productInput.category,
            countInStock: productInput.countInStock
        })

        const createdProduct = await product.save();
        return {...createdProduct._doc, _id: createdProduct._id.toString()}
    },

    createUser: async function({userInput},req){

        const errors = []

        if(!validator.isEmail(userInput.email)){
            errors.push({message:"Invalid Email"})
        }
        if(validator.isEmpty(userInput.passwordHash) ||
            !validator.isLength(userInput.passwordHash,{min:5})){
            errors.push({message:'Password Too Short'})
        }

        if(errors.length > 0){
            const error = new Error('Invlid Input')
            error.data = errors
            error.code = 422
            throw error;
        }

        const user = new User({
            name: userInput.name,
            email: userInput.email,
            passwordHash: bcrypt.hashSync(userInput.passwordHash,10),
            phone: userInput.phone,
            isAdmin: userInput.isAdmin,
            street: userInput.street,
            apartment: userInput.apartment,
            zip: userInput.zip,
            city: userInput.city,
            country: userInput.country
        })

        const createdUser = await user.save()
        return { ...createdUser._doc, _id:createdUser._id.toString()}
    }
}
