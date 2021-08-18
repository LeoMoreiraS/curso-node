import { MissingParamError } from '../Errors/MissingParamError';
import { HttpResponse, HttpRequest } from '../protocols/http';
export class SingUpController {
  handle (httpRequest: HttpRequest): HttpResponse {
    if (!httpRequest.body.name) {
      return { statusCode: 400, body: new MissingParamError('name') };
    } if (!httpRequest.body.email) {
      return { statusCode: 400, body: new MissingParamError('email') };
    }
    return { statusCode: 400, body: { oi: 'oi' } };
  }
}
