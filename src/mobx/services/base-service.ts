import axios, { AxiosError } from 'axios';
import { ResponseSingular, ServiceResult } from './config';

/* eslint-disable @typescript-eslint/no-unused-vars */
export interface IRead<T> {
  find(item: any): Promise<ServiceResult<T[]>>;
  findOne(id: number): Promise<ServiceResult<T>>;
}

export interface IWrite<T> {
  create(item: T): Promise<boolean>;
  update(item: T): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}

export abstract class BaseService<T = any> implements IWrite<T>, IRead<T> {
  create(item: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  update(item: T): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  delete(id: number): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  find(item: any): Promise<ServiceResult<T[]>> {
    throw new Error('Method not implemented.');
  }

  findOne(id: number): Promise<ServiceResult<T>> {
    throw new Error('Method not implemented.');
  }

  processError(error: Error | any) {
    if (axios.isAxiosError(error)) {
      const serverError = error as AxiosError<ResponseSingular>;
      if (serverError.response?.data?.errors) {
        return serverError.response?.data?.errors;
      }
    }
    if (Array.isArray(error)) {
      return error;
    }
    return [error];
  }
}
