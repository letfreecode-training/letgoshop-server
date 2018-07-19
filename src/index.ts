import { ApolloServer, gql } from 'apollo-server';

/** Graphql Server Resolver */
import ProductResolvers from './graphql/resolvers/Product/';

const PORT: string | number = process.env.PORT || 4001;

const typeDefs = gql`
  type Product {
    title: String
    name: String
    price: Int
    tags: [String]
    description: String
  }

  type Query {
    products: [Product]
  }
`;

const resolvers = {
  Query: {
    products: ProductResolvers.GraphqlProductsResolver()
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
