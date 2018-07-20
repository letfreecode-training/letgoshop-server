import ProductResolvers from './Product/';

export const resolvers = {
  Query: {
    products: ProductResolvers.GraphqlProductsResolver()
  }
};
