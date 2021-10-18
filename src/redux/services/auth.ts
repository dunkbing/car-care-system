import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery, HttpMethod } from './config';
import { CustomerLoginQueryModel } from '@models/customer';

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
      query: () => ({ path: `${path}/register`, method: HttpMethod.POST, withProgress: true }),
    }),
  }),
});

export default authApi;
export const { useLoginMutation, useRegisterMutation } = authApi;
