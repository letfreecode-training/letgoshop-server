export const registerSchema = {
  properties: {
    name: {
      type: 'string',
      minLength: 2,
      maxLength: 20
    },
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
  required: ['name', 'email', 'password']
};
