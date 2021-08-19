import { ServerError } from '../Errors/ServerError';
import { HttpResponse } from '../protocols/http';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  body: error
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  body: new ServerError()
});
export const createOk = (data: any): HttpResponse => ({
  statusCode: 201,
  body: data
});
