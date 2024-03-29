const {buildSchema} = require('graphql')
module.exports = buildSchema(`
    
    type ParentCategory{
        name: String!
        id: Category!
    }
    
    type Category{
        _id: ID!
       name: String!
       icon: String
       color: String
       isParent: Boolean!
       isChild: Boolean!
       url: String
       parentCategory: ParentCategory
    }
    
    
    type Product{
       _id: ID!
       name: String!
       description: String!
       richDescription: String
       image: String!
       images: [String]
       brand: String
       price: Int!
       category: Category!
       countInStock: Int!
       rating: Float
       numReviews: Int
       isFeatured: Boolean 
       dateCreated: String
    }
    
    type User{
        _id: ID!
        name: String!
        email: String!
        passwordHash: String!
        phone: String!
        isAdmin: Boolean
        street: String
        apartment: String
        zip: String
        city: String
        country: String
    }

    type Auth{
       id: ID!
       name: String!
       email: String!
       token: String!
       refreshToken: String!
       expiresIn: String! 
    }
    
     type ProductData{
        product: [Product]! 
        totalProducts: Int! 
    }
    
    
    input ProductInputData{
        name: String
        description: String
        richDescription: String
        image: String
        images: [String]
        brand: String
        price: Int
        category: String
        countInStock: Int
        rating: Float
        numReviews: Int
        isFeatured: Boolean 
        dateCreated: String
    }
    
    input UserInputData{
        name: String!
        email: String!
        passwordHash: String!
        phone: String!
        isAdmin: Boolean
        street: String
        apartment: String
        zip: String
        city: String
        country: String
    }

    input LoginInputData{
        email: String!
        password: String!
    }

    type RootMutation{
        createProduct ( productInput: ProductInputData): Product!,
        updateProduct (id:ID, productInput: ProductInputData): Product!,
        deleteProduct (id:ID): Boolean,
        createUser ( userInput: UserInputData ): User!
    }

    type RootQuery{
        hello: String
        login( loginInput: LoginInputData ): Auth!
        getAllProduct(pageNo:Int,postPerPage:Int): ProductData
        getProductById(id:ID): Product 
    }

    schema{
        query: RootQuery
        mutation: RootMutation
    }
`)
