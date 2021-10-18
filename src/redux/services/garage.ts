import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery, HttpMethod } from './config';
import { GarageModel } from '@models/garage';

const path = 'garages';

const garageApi = createApi({
  reducerPath: 'garageApi',
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getGarages: builder.query<Array<GarageModel>, unknown>({
      query: (Keyword: string) => ({
        path: `${path}`,
        method: HttpMethod.GET,
        getPlural: true,
        params: { Keyword },
      }),
    }),
  }),
});

export default garageApi;
export const { useGetGaragesQuery } = garageApi;
