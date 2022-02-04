const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { importSchema } = require('graphql-import');
const rootResolver = require('./graphql/resolvers');

const app = express();
app.use(express.json());

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(importSchema('./graphql/schema/schema.gql')),

  // will hold all resolvers
  rootValue: rootResolver,
  graphiql: true,
}));

app.listen(3000);