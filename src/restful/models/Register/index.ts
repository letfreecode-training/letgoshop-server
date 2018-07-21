import { Router, Request, Response } from 'express';
import * as Ajv from 'ajv';
import { createHmac } from 'crypto';
import * as mongoose from 'mongoose';

const ajv = new Ajv();

import { registerSchema } from './schema';

type RegisterType = {
  name: string;
  email: string;
  password: string;
};

const createHashPassword = (password: string) =>
  createHmac('sha256', '__secret')
    .update(password)
    .digest('hex');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
const UserModel = mongoose.model('User', UserSchema);

const RegisterRouter = (routers: Router) => {
  routers.post('/register', (req: Request, res: Response) => {
    const body = req.body;
    const validate = ajv.compile(registerSchema);
    const valid = validate(body);
    if (!valid) {
      res.status(200).send({
        statusCode: '200',
        error: {
          message: validate.errors
        }
      });
    } else {
      const { name, email, password }: RegisterType = body;
      UserModel.findOne(
        {
          email
        },
        (err, register) => {
          if (!register) {
            const hashPassword = createHashPassword(password);

            let user = new UserModel({
              name,
              email,
              password: hashPassword
            });

            user
              .save()
              .then(() => {
                res.status(200).send({
                  statusCode: 200,
                  data: {
                    message: 'create user success'
                  }
                });
              })
              .catch(err => console.log(err));
          } else {
            res.status(200).send({
              statusCode: 200,
              error: {
                message: ['重複註冊']
              }
            });
          }
        }
      );
    }
  });

  return routers;
};

export default RegisterRouter;
