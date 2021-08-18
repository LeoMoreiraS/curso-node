import { SingUpController } from './SingUpController';
import { MissingParamError } from '../Errors/MissingParamError';
import { InvalidParamError } from '../Errors/InvalidParamError';
import { EmailValidator } from '../protocols/EmailValidator';

interface SutTypes{
  sut: SingUpController
  emailValidatorStub: EmailValidator
}
class EmailValidatorStub implements EmailValidator {
  isValid (email: string): boolean {
    return true;
  }
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SingUpController(emailValidatorStub);
  return {
    sut,
    emailValidatorStub
  };
};

describe('SingUp Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut();
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
    const { sut } = makeSut();
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
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'Pedrin',
        email: 'pedrin@gmail.com',
        // password: 'password',
        passwordConfirm: 'password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
  test('Should return 400 if no passwordConfirm is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'Pedrin',
        email: 'pedrin@gmail.com',
        password: 'password'
        // passwordConfirm: 'password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'));
  });
  test('Should return 400 if invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'Pedrin',
        email: 'pedrin@gmail.com',
        password: 'password',
        passwordConfirm: 'password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });
});
