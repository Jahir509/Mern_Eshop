const {buildSchema} = require('graphql')

module.exports = buildSchema(`
    
    type NameQuery{
        name: String!
        age: Int!
    }
    
    type RootQuery{
        sayMyName: NameQuery!
    }
    
    schema {
        query: RootQuery
    }
    
`);
