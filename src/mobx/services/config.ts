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

export type ResponseData<T> = {
  records: T | Array<T>;
  pagination: Pagination;
};

export type ResponseError = {
  field: any;
  message: string;
};

export type Response<T = any> = {
  executeStatus: string;
  executeMessage: string;
  executeCode: number;
  data: { result: ResponseData<T> };
  errors: Array<ResponseError>;
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
