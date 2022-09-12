const {Product} = require('../models/product')
const {User} = require('../models/user')
const bcrypt = require('bcryptjs')
const validator = require('validator')
const jwt = require('jsonwebtoken');

module.exports = {
    createProduct: async function({productInput},req){
        if(!req.isAuth){
            const error = new Error("User not authenticated");
            error.code = 401
            throw error
        }
        const errors = [];

        if(!validator.isEmpty(productInput.name)){
            errors.push({message:"name not defined"})
        }
        if(!validator.isEmpty(productInput.description)){
            errors.push({message:"description not defined"})
        }
        if(!validator.isEmpty(productInput.image)){
            errors.push({message:"image not defined"})
        }
        if(!validator.isEmpty(productInput.price)){
            errors.push({message:"price not defined"})
        }
        if(!validator.isEmpty(productInput.category)){
            errors.push({message:"category not defined"})
        }
        if(!validator.isEmpty(productInput.countInStock)){
            errors.push({message:"countInStock not defined"})
        }

        if (errors.length > 0) {
            const error = new Error('Invalid input.');
            error.data = errors;
            error.code = 422;
            throw error;
        }

        const user = await User.findById(req.userId);
        if (!user) {
            const error = new Error('Invalid user.');
            error.code = 401;
            throw error;
        }

        const product = new Product({
            name: productInput.name,
            description: productInput.description,
            image: productInput.image,
            price: productInput.price,
            category: productInput.category,
            countInStock: productInput.countInStock,
            rating: productInput.rating,
            numReviews: productInput.numReviews,
            isFeatured: productInput.isFeatured,
            images: productInput.images,
            brand: productInput.brand,
            richDescription: productInput.richDescription

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
    },

    login: async function({loginInput},req){
        const user = await User.findOne({email:loginInput.email})
        const secret = process.env.SECRET;
        if(!user) {
           const error = new Error("User Not Found");
           error.code = 401;
           throw error;
        }

        if(user && bcrypt.compareSync(loginInput.password,user.passwordHash))  {
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

            return {
                id:user._id.toString(),
                name:user.name,
                email:user.email,
                token:token,
                refreshToken:refreshToken,
                expiresIn: new Date(new Date().getTime() + 64764000 )  // 17.99 hours = 64764000 ms due to GMT+6
                // expiresIn:new Date(new Date().getTime()+ 180000)
            };
        }
        else {
            const error = new Error("Incorrect Password")
            error.code = 401
            throw error
        }
    }
}
