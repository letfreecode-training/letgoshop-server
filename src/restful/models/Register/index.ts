import { Router, Request, Response } from 'express';
import * as mongoose from 'mongoose';
import * as Ajv from 'ajv';
import { createHmac } from 'crypto';
var ajv = new Ajv();

type RegisterType = {
  name: string;
  email: string;
  password: string;
};

const registerSchema = {
  properties: {
    name: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    }
  },
  required: ['name', 'email', 'password']
};

const createHashPassword = (password: string) =>
  createHmac('sha256', '__secret')
    .update(password)
    .digest('hex');

const connectAndQueryMongo = (query: Function) => {
  mongoose.connect(
    'mongodb://127.0.0.1:27017/letgoshop',
    { useNewUrlParser: true },
    () => {
      query();
    }
  );
};

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
      res.status(400).send({
        statusCode: '400',
        error: {
          message: validate.errors
        }
      });
    } else {
      const { name, email, password }: RegisterType = body;
      connectAndQueryMongo(() => {
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

              user.save().then(() => {
                res.status(200).send({
                  statusCode: 200,
                  data: {
                    message: 'create user success'
                  }
                });
              });
            } else {
              res.status(200).send({
                statusCode: 200,
                error: {
                  errors: ['重複註冊']
                }
              });
            }
          }
        );
      });
    }
  });

  return routers;
};

export default RegisterRouter;
