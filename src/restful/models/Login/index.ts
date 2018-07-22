import { readFileSync } from 'fs';
import { resolve } from 'path';
import { Router, Request, Response } from 'express';
import * as Ajv from 'ajv';
import * as mongoose from 'mongoose';
import { RedisClient } from 'redis';
import { createHmac } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { loginSchema } from './schema';
import { UserSchema } from '../../../modules/mongodb/schema/User';

const ajv = new Ajv();
const cert = readFileSync(
  resolve(__dirname, '../../../keys/localhost-privkey.pem')
);

const createHashPassword = (password: string) =>
  createHmac('sha256', '__secret')
    .update(password)
    .digest('hex');

const createJWTToken = (data: { name: string; email: string }): string =>
  jwt.sign(
    {
      name: data.name,
      email: data.email
    },
    cert,
    { algorithm: 'RS256' }
  );

const insertRedis = (redisClient: RedisClient, key: string, data: object) => {
  return new Promise((resolve, reject) => {
    redisClient.set(key, JSON.stringify(data), 'EX', 3600, done => {
      if (!done) {
        resolve();
      } else {
        reject(done);
      }
    });
  });
};

const UserModel = mongoose.model('User', UserSchema);

const LoginRouter = (routers: Router, redisClient: RedisClient) => {
  routers.post('/login', (req: Request, res: Response) => {
    const body = req.body;
    const validate = ajv.compile(loginSchema);
    const valid = validate(body);
    if (!valid) {
      res.status(200).send({
        statusCode: '200',
        error: {
          message: validate.errors
        }
      });
    } else {
      const { email, password } = body;
      const hashPassword = createHashPassword(password);
      UserModel.findOne(
        {
          email,
          password: hashPassword
        },
        (err, user: any) => {
          if (!user) {
            res.status(200).send({
              statusCode: 200,
              error: {
                message: 'no email or password'
              }
            });
          } else {
            var token: string = createJWTToken({ name: user.name, email });
            insertRedis(redisClient, token, { name: user.name, email });
            res.append(
              'Set-Cookie',
              `ut=${token}; Path=/; expires=${new Date(
                new Date().getTime() + 3600000
              )}; HttpOnly`
            );
            res.status(200).send({
              statusCode: 200,
              data: {
                message: 'login success',
                payload: {
                  name: user.name,
                  email: user.email
                }
              }
            });
          }
        }
      );
    }
  });

  return routers;
};

export default LoginRouter;
