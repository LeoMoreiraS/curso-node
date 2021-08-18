import { MissingParamError } from '../Errors/MissingParamError';
import { HttpResponse, HttpRequest } from '../protocols/http';
import { badRequest } from '../helpers/http-helper';
export class SingUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return badRequest(new MissingParamError('name'));
    } if (!httpRequest.body.email) {
      return badRequest(new MissingParamError('email'));
    }
    return { statusCode: 400, body: { oi: 'oi' } };
  }
}
