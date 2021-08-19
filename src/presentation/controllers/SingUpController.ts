import { MissingParamError, InvalidParamError } from '../Errors';
import { HttpResponse, HttpRequest, EmailValidator, Controller } from '../protocols';
import { badRequest, serverError } from '../helpers/http-helper';
export class SingUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator;
  }

  handle (httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirm'];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) return badRequest(new MissingParamError(field));
      }
      if (httpRequest.body.password !== httpRequest.body.passwordConfirm) { return badRequest(new InvalidParamError('passwordConfirm')); };
      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) { return badRequest(new InvalidParamError('email')); }
      return badRequest(new InvalidParamError('nope'));
    } catch (error) {
      return serverError();
    }
  }
}
