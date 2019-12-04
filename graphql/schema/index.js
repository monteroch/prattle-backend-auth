const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type User{
        _id: ID!
        email: String!
        password: String
    }

    type AuthData{
        userId: ID!
    }

    type UserData{
        userId: ID!
        email: String!
    }

    input UserInput {
        email: String!
        password: String
    }

    type RootQuery {
        users: [User!]!
        login(email: String!, password: String!): AuthData
        fetchUser: UserData
    }

    type RootMutation {
        createUser(userInput: UserInput): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);