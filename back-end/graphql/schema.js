const {buildSchema} = require('graphql')

module.exports = buildSchema(`
    
    type ParentCategory{
        name: String!
        id: Category!
    }
    
    type Category{
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
       images: [String],
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
    
    
    input ProductInputData{
       name: String!
       description: String!
       image: String!
       price: Int!
       category: String!
       countInStock: Int!
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

    type RootMutation{
        createProduct ( productInput: ProductInputData): Product!,
        createUser ( userInput: UserInputData ): User!
    }

    type RootQuery{
        hello: String
    }

    schema{
        query: RootQuery
        mutation: RootMutation
    }
`)
