/** Graphql Server */
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';

/** redis */
import { createRedisClient } from './modules/redis';

/** apollo server */

import { ApolloServer, gql } from 'apollo-server-express';

/** Graphql Server Type and Resolver */
import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';

/** Mongodb */
import { createMongoConnection } from './modules/mongodb';

/** Restful API */
import RegisterRouter from './restful/models/Register/';
import LoginRouter from './restful/models/Login';

const PORT: string | number = process.env.PORT || 4001;

const server = new ApolloServer({ typeDefs, resolvers });
createMongoConnection({
  useNewUrlParser: true,
  poolSize: 5
});
const redisClient = createRedisClient();

const app = express();
const routers = express.Router();

app.use(bodyParser.json());
app.use(
  '/api',
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  }),
  RegisterRouter(routers),
  LoginRouter(routers, redisClient)
);

server.applyMiddleware({ app });

app.listen({ port: PORT });
