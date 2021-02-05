const {buildSchema} = require('graphql')

module.exports = buildSchema(`
    type Todo {
        id: ID!
        title: String!
        done: Boolean!
        createdAt: String
        updatedAt: String
    }

    type Query {
    getTodos: [Todo!]!
  }
  
  input TodoInput {
    title: String!
  }
  
  type Mutation {
    createTodo(todo: TodoInput!): Todo!
    completeTodo(id: ID!): Todo!
  }
`)