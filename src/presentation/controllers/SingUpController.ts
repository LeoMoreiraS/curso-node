import { MissingParamError } from '../Errors/MissingParamError';
import { HttpResponse, HttpRequest } from '../protocols/http';
import { badRequest } from '../helpers/http-helper';
export class SingUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirm'];
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) return badRequest(new MissingParamError(field));
    }
    return { statusCode: 400, body: { oi: 'oi' } };
  }
}
