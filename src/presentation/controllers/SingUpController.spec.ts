import { SingUpController } from './SingUpController';

describe('SingUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SingUpController();
    const httpRequest = {
      body: {
        // name: 'Pedrin',
        email: 'pedrin@gmail.com',
        password: 'password',
        passwordConfirm: 'password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new Error('Missing param: name'));
  });
});
