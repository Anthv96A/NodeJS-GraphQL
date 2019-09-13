const { buildSchema } = require('graphql');


module.exports = buildSchema(`
    type User {
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
    }

    input UserInputData {
        name: String!
        email: String!
        password: String
        id: ID
    }

    type RootMutation {
        createUser(userInput: UserInputData): User!
        updateUser(userInput: UserInputData): User!
        deleteUser(email: String!): Boolean!
    }

    type RootQuery {
        hello: String
        getUser(id: ID!): User!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);