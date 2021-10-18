import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery, HttpMethod } from './config';
import { CustomerLoginQueryModel, CustomerRegisterQueryModel } from '@models/customer';

const path = 'auth/customer';

const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (loginQuery: CustomerLoginQueryModel) => ({
        path: `${path}/login`,
        method: HttpMethod.POST,
        data: loginQuery,
        withProgress: true,
      }),
    }),
    register: builder.mutation({
      query: (registerQuery: CustomerRegisterQueryModel) => ({
        path: `${path}/register`,
        method: HttpMethod.POST,
        data: registerQuery,
        withProgress: true,
      }),
    }),
  }),
});

export default authApi;
export const { useLoginMutation, useRegisterMutation } = authApi;
