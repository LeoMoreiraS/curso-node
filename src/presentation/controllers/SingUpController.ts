import { MissingParamError } from '../Errors/MissingParamError';
import { InvalidParamError } from '../Errors/InvalidParamError';
import { HttpResponse, HttpRequest } from '../protocols/http';
import { badRequest } from '../helpers/http-helper';
import { Controller } from '../protocols/Controller';
import { EmailValidator } from '../protocols/EmailValidator';
import { ServerError } from '../Errors/ServerError';
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
      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) { return badRequest(new InvalidParamError('email')); }
      return badRequest(new InvalidParamError('nope'));
    } catch (error) {
      return {
        statusCode: 500,
        body: new ServerError()
      };
    }
  }
}
