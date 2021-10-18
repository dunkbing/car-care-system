import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery, HttpMethod } from './config';
import { GarageModel } from '@models/garage';

const path = 'garages';

const garageApi = createApi({
  reducerPath: 'garageApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getGarages: builder.query<Array<GarageModel>, unknown>({
      query: (keyword: string) => ({
        path: `${path}?Keyword=${keyword}`,
        method: HttpMethod.GET,
        getPlural: true,
      }),
    }),
  }),
});

export default garageApi;
export const { useGetGaragesQuery } = garageApi;
