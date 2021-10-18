/* eslint-disable indent */
import { BaseQueryFn } from '@reduxjs/toolkit/query';
import axios, { AxiosRequestConfig, AxiosError, Method } from 'axios';
import { API_URL } from '@env';
import { showProgress } from './dialog';
import store from '../store';

type RequestError = {
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
  records: Array<T>;
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
const fullPath = (basePath: string, path: string) => {
  return basePath + (path !== '' ? '/' + path : '');
};

// axios-based baseQuery utility
const axiosBaseQuery =
  (
    { baseUrl }: { baseUrl: string } = { baseUrl: API_URL },
  ): BaseQueryFn<
    {
      path: string;
      method: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      getPlural?: boolean;
      withProgress?: boolean;
    },
    Response,
    RequestError
  > =>
  async ({ path, method, data, getPlural, withProgress }): Promise<any> => {
    const progressDialogState = store.getState().progressDialog.value;

    try {
      withProgress && store.dispatch(showProgress({ ...progressDialogState, isOpen: true }));
      const result = await axios({ url: fullPath(baseUrl, path), method, data });
      const responseData = result.data as Response;
      const errors: ResponseError[] = responseData.errors;
      const error = errors && errors.length ? errors[0].message : null;

      withProgress && store.dispatch(showProgress({ ...progressDialogState, isOpen: false }));

      if (getPlural) {
        return { data: responseData.data.result.records, error };
      }
      return { data: responseData.data.result, error };
    } catch (axiosError) {
      const err = axiosError as AxiosError<any>;
      const errors: any[] = err.response?.data?.errors;
      const message = errors && errors.length ? errors[0].message : '';

      withProgress && store.dispatch(showProgress({ ...progressDialogState, isOpen: false }));
      return {
        data: null,
        error: { status: err.response?.status, message },
      };
    }
  };

export const HttpMethod: { [key: string]: Method } = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};

export { axiosBaseQuery };
