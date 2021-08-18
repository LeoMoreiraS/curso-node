import { SingUpController } from './SingUpController';
import { MissingParamError } from '../Errors/MissingParamError';
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
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });
  test('Should return 400 if no email is provided', () => {
    const sut = new SingUpController();
    const httpRequest = {
      body: {
        name: 'Pedrin',
        // email: 'pedrin@gmail.com',
        password: 'password',
        passwordConfirm: 'password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
});
