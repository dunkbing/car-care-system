import { API_URL } from '@env';
import DialogStore from '@mobx/stores/dialog';
import axios, { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';
import Container, { Service } from 'typedi';
import { ResponsePlural, ResponseSingular, ServiceResult, WithPagination, withProgress } from './config';

declare type QueryParams = { [param: string]: string | string[] };
// eslint-disable-next-line @typescript-eslint/ban-types
declare type RequestParams = object | string | number | boolean | any | (object | string | number | boolean | any)[];

/**
 * WEB API service.
 */
@Service()
export class ApiService {
  private basePath: string = API_URL;
  accessToken: string | undefined | null = '';
  private readonly dialogStore = Container.get(DialogStore);

  public setBasePath(host: string, path: string, useHttps = true): void {
    const scheme = useHttps ? 'https' : 'http';
    this.basePath = `${scheme}://${host}/${path}`;
  }

  public async get<Response>(path: string, params?: RequestParams, reportProgress = false): Promise<ServiceResult<Response>> {
    const headers = this.createRequestHeaders();
    let promise = axios.get<any, AxiosResponse<ResponseSingular<Response>>>(this.createRequestURL(path), {
      headers,
      params,
    });
    if (reportProgress) {
      promise = withProgress(promise);
    }
    try {
      const response = await promise;
      const { data } = response;
      if (data.errors.length) {
        return { result: null, error: data.errors };
      }
      return { result: data.data.result, error: null };
    } catch (error) {
      return { result: null, error: this.processError(error) };
    } finally {
      this.dialogStore.closeProgressDialog();
    }
  }

  public async getPlural<Response>(path: string, params?: RequestParams, reportProgress = false): Promise<ServiceResult<Response[]>> {
    const headers = this.createRequestHeaders();
    let promise = axios.get<any, AxiosResponse<ResponsePlural<Response>>>(this.createRequestURL(path), {
      headers,
      params,
    });
    if (reportProgress) {
      promise = withProgress(promise);
    }
    try {
      const response = await promise;
      const { data } = response;
      if (data.errors.length) {
        return { result: null, error: data.errors };
      }
      return { result: data.data.result, error: null };
    } catch (error) {
      return { result: null, error: this.processError(error) };
    }
  }

  public async getPluralWithPagination<Response>(
    path: string,
    params?: RequestParams,
    reportProgress = false,
  ): Promise<ServiceResult<Response[]>> {
    const headers = this.createRequestHeaders();
    let promise = axios.get<any, AxiosResponse<WithPagination<Response>>>(this.createRequestURL(path), {
      headers,
      params,
    });
    if (reportProgress) {
      promise = withProgress(promise);
    }
    try {
      const response = await promise;
      const { data } = response;
      if (data.errors.length) {
        return { result: null, error: data.errors };
      }
      return { result: data.data.result.records, error: null };
    } catch (error) {
      return { result: null, error: this.processError(error) };
    }
  }

  public async post<Response>(
    path: string,
    params?: RequestParams,
    reportProgress = false,
    formData = false,
  ): Promise<ServiceResult<Response>> {
    const headers = this.createRequestHeaders();
    let promise;
    if (formData) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(params)) {
        formData.append(key, value);
      }
      promise = axios.post<any, AxiosResponse<ResponseSingular<Response>>>(this.createRequestURL(path), formData, {
        headers: { ...headers, 'Content-Type': 'multipart/form-data' },
      });
    } else {
      promise = axios.post<any, AxiosResponse<ResponseSingular<Response>>>(this.createRequestURL(path), params, { headers });
    }
    if (reportProgress) {
      promise = withProgress(promise);
    }
    try {
      const response = await promise;
      const { data } = response;
      if (data.errors.length) {
        return { result: null, error: data.errors };
      }
      return { result: data.data.result, error: null };
    } catch (error) {
      return { result: null, error: this.processError(error) };
    } finally {
      this.dialogStore.closeProgressDialog();
    }
  }

  public async put<Response>(
    path: string,
    params?: RequestParams,
    reportProgress = false,
    formData = false,
  ): Promise<ServiceResult<Response>> {
    const headers = this.createRequestHeaders();
    let promise;
    if (formData) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(params)) {
        formData.append(key, value);
      }
      promise = axios.put<any, AxiosResponse<ResponseSingular<Response>>>(this.createRequestURL(path), formData, { headers });
    } else {
      promise = axios.put<any, AxiosResponse<ResponseSingular<Response>>>(this.createRequestURL(path), params, { headers });
    }
    if (reportProgress) {
      promise = withProgress(promise);
    }
    try {
      const response = await promise;
      const { data } = response;
      if (data.errors.length) {
        return { result: null, error: data.errors };
      }
      return { result: data.data.result, error: null };
    } catch (error) {
      return { result: null, error: this.processError(error) };
    } finally {
      this.dialogStore.closeProgressDialog();
    }
  }

  public async patch<Response>(path: string, params?: RequestParams, reportProgress = false): Promise<ServiceResult<Response>> {
    const headers = this.createRequestHeaders();
    let promise = axios.patch<any, AxiosResponse<ResponseSingular<Response>>>(this.createRequestURL(path), params, { headers });
    if (reportProgress) {
      promise = withProgress(promise);
    }
    try {
      const response = await promise;
      const { data } = response;
      if (data.errors.length) {
        return { result: null, error: data.errors };
      }
      return { result: data.data.result, error: null };
    } catch (error) {
      return { result: null, error: this.processError(error) };
    } finally {
      this.dialogStore.closeProgressDialog();
    }
  }

  public async delete<Response>(path: string, params?: QueryParams, reportProgress = false): Promise<ServiceResult<Response>> {
    const headers = this.createRequestHeaders();
    let promise = axios.delete<any, AxiosResponse<ResponseSingular<Response>>>(this.createRequestURL(path), {
      headers,
      params,
    });
    if (reportProgress) {
      promise = withProgress(promise);
    }
    try {
      const response = await promise;
      const { data } = response;
      if (data.errors.length) {
        return { result: null, error: data.errors };
      }
      return { result: data.data.result, error: null };
    } catch (error) {
      return { result: null, error: this.processError(error) };
    }
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

  private createRequestHeaders(): AxiosRequestHeaders {
    const headers: any = {};
    headers['Content-Type'] = 'application/json; charset=UTF-8';
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }
    return headers;
  }

  private createRequestURL(path: string): string {
    if (/^(https?:)?\/\//.test(path)) {
      return path;
    } else {
      return `${this.basePath}/${path}`;
    }
  }
}
