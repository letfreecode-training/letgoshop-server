export const loginSchema = {
  properties: {
    email: {
      type: 'string',
      minLength: 5,
      maxLength: 100
    },
    password: {
      type: 'string',
      minLength: 10,
      maxLength: 50
    }
  },
  required: ['email', 'password']
};
