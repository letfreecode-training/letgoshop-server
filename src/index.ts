/** Graphql Server */
import { ApolloServer, gql } from 'apollo-server';

/** Graphql Server Type and Resolver */
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';

const PORT: string | number = process.env.PORT || 4001;

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
