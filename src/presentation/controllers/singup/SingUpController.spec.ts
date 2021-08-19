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
    async add (account: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid-id',
        name: 'valid-name',
        email: 'valid-email@gmail.com',
        password: 'valid-password'
      };
      return new Promise(resolve => resolve(fakeAccount));
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
  test('Should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        // name: 'Pedrin',
        email: 'pedrin@gmail.com',
        password: 'password',
        passwordConfirm: 'password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });
  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'Pedrin',
        // email: 'pedrin@gmail.com',
        password: 'password',
        passwordConfirm: 'password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'Pedrin',
        email: 'pedrin@gmail.com',
        // password: 'password',
        passwordConfirm: 'password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
  test('Should return 400 if no passwordConfirm is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'Pedrin',
        email: 'pedrin@gmail.com',
        password: 'password'
        // passwordConfirm: 'password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirm'));
  });
  test('Should return 400 if invalid email is provided', async () => {
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
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });
  test('Should call EmailValidator with correct email', async () => {
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
    await sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('pedrin@gmail.com');
  });
  test('Should return 500 EmailValidator throws Exception', async () => {
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
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  test('Should return 400 if passwords dont match', async () => {
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
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirm'));
  });
  test('Should call addAccount with correct values', async () => {
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
    await sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'Pedrin',
      email: 'pedrin@gmail.com',
      password: 'password'
    });
  });
  test('Should return 500 addAccount throws Exception', async () => {
    const { sut, addAccountStub } = makeSut();
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => reject(new Error()));
    });
    const httpRequest = {
      body: {
        name: 'Pedrin',
        email: 'pedrin@gmail.com',
        password: 'password',
        passwordConfirm: 'password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
  test('Should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'valid-name',
        email: 'valid-email@gmail.com',
        password: 'valid-password',
        passwordConfirm: 'valid-password'
      }
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(201);
    expect(httpResponse.body).toEqual({
      id: 'valid-id',
      name: 'valid-name',
      email: 'valid-email@gmail.com',
      password: 'valid-password'
    });
  });
});
