/* eslint-disable indent */
import { Method } from 'axios';

export type RequestError = {
  status?: number;
  data?: unknown;
  message?: string;
};

export type Pagination = {
  totalPages: number;
  displayItems: number;
  totalRecords: number;
  currentPage: number;
};

export type ResponseError = {
  field: any;
  message: string;
};

export type Response = {
  executeStatus: string;
  executeMessage: string;
  executeCode: number;
};

export type ResponseSingular<T = any> = Response & {
  data: {
    result: T;
  };
  errors: Array<ResponseError>;
};

export type ResponsePlural<T = any> = Response & {
  data: {
    result: {
      records: Array<T>;
      pagination: Pagination;
    };
  };
  errors: Array<ResponseError>;
};

export type ServiceResult<T> = {
  result: T | null;
  error: any | null;
};

// create a full path from base url and path
export const fullPath = (basePath: string, path: string) => {
  return basePath + (path !== '' ? '/' + path : '');
};

export const toParams = (obj: Record<string, any>) => new URLSearchParams(obj).toString();

export const HttpMethod: { [key: string]: Method } = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};
