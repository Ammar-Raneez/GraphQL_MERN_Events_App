const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const { importSchema } = require('graphql-import');
const mongoose = require('mongoose');
const rootResolver = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(isAuth);

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(importSchema('./graphql/schema/schema.gql')),

  // will hold all resolvers
  rootValue: rootResolver,
  graphiql: true,
}));

mongoose.connect(
  process.env.MONGO_URI
).then(() => {
  console.log('Connected to mongoDB');
  app.listen(3000);
}).catch((err) => {
  console.log(err);
});
