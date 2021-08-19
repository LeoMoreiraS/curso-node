import { MissingParamError, InvalidParamError } from '../../Errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import { AddAccount, HttpResponse, HttpRequest, EmailValidator, Controller } from './SingUpProtocols';
export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly addAccount: AddAccount;
  constructor (emailValidator: EmailValidator, addAccount: AddAccount) {
    this.emailValidator = emailValidator;
    this.addAccount = addAccount;
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field));
      }
      const { name, email, password, passwordConfirm } = httpRequest.body;
      if (password !== passwordConfirm) { return badRequest(new InvalidParamError('passwordConfirm')); };
      const isValid = this.emailValidator.isValid(email);
      if (!isValid) { return badRequest(new InvalidParamError('email')); }
      const account = this.addAccount.add({
        name,
        email,
        password
      });
      if (account.email !== email) { return badRequest(new InvalidParamError('email')); }
      return badRequest(new InvalidParamError('nope'));
    } catch (error) {
      return serverError();
    }
  }
}
