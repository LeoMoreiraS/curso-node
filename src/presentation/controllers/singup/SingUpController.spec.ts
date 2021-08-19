import { SingUpController } from './SingUpController';
import { MissingParamError, InvalidParamError, ServerError } from '../../Errors';
import { AddAccount, AccountModel, AddAccountModel, EmailValidator } from './SingUpProtocols';
const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid-id',
        name: 'valid-name',
        email: 'valid-email@gmail.com',
        password: 'valid-password'
      };
      return fakeAccount;
    }
  }
  return new AddAccountStub();
};

interface SutTypes{
  sut: SingUpController
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
}
const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidator();
  const addAccountStub = makeAddAccount();
  const sut = new SingUpController(emailValidatorStub, addAccountStub);
  return {
    sut,
    emailValidatorStub,
    addAccountStub
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
        email: 'invalid_email@gmail.com',
        password: 'password',
        passwordConfirm: 'password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });
  test('Should call EmailValidator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'Pedrin',
        email: 'pedrin@gmail.com',
        password: 'password',
        passwordConfirm: 'password'
      }
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('pedrin@gmail.com');
  });
  test('Should return 500 EmailValidator throws Exception', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: 'Pedrin',
        email: 'pedrin@gmail.com',
        password: 'password',
        passwordConfirm: 'password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  test('Should return 400 if passwords dont match', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: 'Pedrin',
        email: 'pedrin@gmail.com',
        password: 'password',
        passwordConfirm: 'password1'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirm'));
  });
  test('Should call addAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut();
    const addSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = {
      body: {
        name: 'Pedrin',
        email: 'pedrin@gmail.com',
        password: 'password',
        passwordConfirm: 'password'
      }
    };
    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'Pedrin',
      email: 'pedrin@gmail.com',
      password: 'password'
    });
  });
  test('Should return 500 addAccount throws Exception', () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: 'Pedrin',
        email: 'pedrin@gmail.com',
        password: 'password',
        passwordConfirm: 'password'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
