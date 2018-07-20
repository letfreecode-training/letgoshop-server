import { ResolverFn } from 'apollo-server-express';
import * as fs from 'fs';
import * as path from 'path';

const GraphqlProductsResolver = (): ResolverFn => (
  rootValue,
  args,
  context,
  info
) => {
  const products = fs
    .readFileSync(path.resolve(__dirname, '../../../mock/products.json'))
    .toString();

  return JSON.parse(products);
};

export default {
  GraphqlProductsResolver
};
