import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery, HttpMethod } from './config';
import { EmployeeModel, CreateEmployeeModel, UpdateEmployeeModel } from '@models/employee';

const path = 'employees';

const employeeApi = createApi({
  reducerPath: 'employeeApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getEmployees: builder.query<EmployeeModel[], unknown>({
      query: (Keyword: string) => ({
        path,
        method: HttpMethod.GET,
        data: {
          Keyword,
        },
        getPlural: true,
      }),
    }),
    getEmployeeById: builder.query({
      query: (id: string | number) => ({ path: `${path}/${id}`, method: HttpMethod.GET }),
    }),
    createEmployee: builder.mutation({
      query: (emp: CreateEmployeeModel) => ({
        path,
        method: HttpMethod.POST,
        data: emp,
        withProgress: true,
      }),
    }),
    updateEmployee: builder.mutation({
      query: (emp: UpdateEmployeeModel) => ({
        path,
        method: HttpMethod.PUT,
        data: emp,
        withProgress: true,
      }),
    }),
    deleteEmployeeById: builder.mutation({
      query: (id: string | number) => ({ path: `${path}/${id}`, method: HttpMethod.DELETE, withProgress: true }),
    }),
  }),
});

export default employeeApi;
export const {
  useGetEmployeesQuery,
  useGetEmployeeByIdQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeByIdMutation,
} = employeeApi;
