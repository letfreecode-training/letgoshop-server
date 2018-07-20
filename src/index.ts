/** Graphql Server */
import * as express from 'express';
import * as bodyParser from 'body-parser';
import { ApolloServer, gql } from 'apollo-server-express';

/** Graphql Server Type and Resolver */
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';

/** Restful API */
import RegisterRouter from './restful/models/Register/';

const PORT: string | number = process.env.PORT || 4001;

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
const routers = express.Router();

app.use(bodyParser.json());
app.use('/api', RegisterRouter(routers));

server.applyMiddleware({ app });

app.listen({ port: PORT });
