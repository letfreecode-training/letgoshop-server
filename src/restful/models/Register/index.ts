import { Router, Request, Response } from 'express';
import * as mongoose from 'mongoose';
import * as Ajv from 'ajv';
var ajv = new Ajv();

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
      const { name, email, password } = body;
      mongoose.connect(
        'mongodb://127.0.0.1:27017/letgoshop',
        { useNewUrlParser: true },
        () => {
          let user = new UserModel({
            name,
            email,
            password
          });
          user.save().then(() => {
            res.status(200).send({
              statusCode: 200,
              data: {
                message: 'create user success'
              }
            });
            mongoose.disconnect();
          });
        }
      );
      // mongoose.disconnect();
    }
  });

  return routers;
};

export default RegisterRouter;
