var makeExecutableSchema = require("graphql-tools").makeExecutableSchema;
var _a = require("./patient"), typeDefs = _a.typeDefs, resolvers = _a.resolvers;
module.exports = makeExecutableSchema({ typeDefs: typeDefs, resolvers: resolvers });
