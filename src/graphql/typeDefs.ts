import { gql } from 'apollo-server-express';

export const typeDefs = gql`
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
