import { dialogStore } from '@mobx/stores/dialog';
import axios, { Method } from 'axios';

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
  executeStatus: 'Success' | 'failed';
  executeMessage: string | null;
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
    result: Array<T>;
  };
  errors: Array<ResponseError>;
};

export type WithPagination<T = any> = Response & {
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

export function setHeader(key: string, value: string) {
  (axios.defaults.headers as any)[key] = value;
}

/**
 * show progress for an async operation.
 * @param promise async openration.
 * @returns promise result
 */
export async function withProgress<T = any>(promise: Promise<T>) {
  dialogStore.openProgressDialog({ title: 'Vui lòng đợi' });
  const result = await promise;
  dialogStore.closeProgressDialog();
  return result;
}
