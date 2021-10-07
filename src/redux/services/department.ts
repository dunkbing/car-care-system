import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery, HttpMethod } from './config';
import { CreateDepartmentModel, DepartmentModel, UpdateDepartmentModel } from '@models/department';

const path = 'departments';

const departmentApi = createApi({
  reducerPath: 'departmentApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getDepartments: builder.query<DepartmentModel[], unknown>({
      query: (keyword: string) => ({
        path,
        method: HttpMethod.GET,
        data: {
          keyword,
        },
        getPlural: true,
      }),
    }),
    getDepartmentById: builder.query<DepartmentModel, unknown>({
      query: (id: string | number) => ({ path: `${path}/${id}`, method: HttpMethod.GET }),
    }),
    createDepartment: builder.mutation({
      query: (dpm: CreateDepartmentModel) => ({
        path,
        method: HttpMethod.POST,
        data: dpm,
        withProgress: true,
      }),
    }),
    updateDepartment: builder.mutation({
      query: (dpm: UpdateDepartmentModel) => ({
        path,
        method: HttpMethod.PUT,
        data: dpm,
        withProgress: true,
      }),
    }),
    deleteDepartmentById: builder.mutation({
      query: (id: string | number) => ({ path: `${path}/${id}`, method: HttpMethod.DELETE, withProgress: true }),
    }),
  }),
});

export default departmentApi;
export const {
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentByIdMutation,
} = departmentApi;
