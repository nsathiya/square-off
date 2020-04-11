const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
// const { graphqlExpress, graphiqlExpress } = require("apollo-server-express");
const api = require('./api');
require('dotenv').config();
const schema = require("./schema");

const app = express();

app.use(cors());
app.use('/api', api)
// app.use("/graphiql", graphiqlExpress({endpointURL: "/graphql"}));
// app.use("/graphql", bodyParser.json(), graphqlExpress({ schema }));


const PORT = 9000;

app.listen(PORT, () => {
  console.log(`Hackernews GraphQL server running on port ${PORT}.`);
});
