import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//@ts-ignore
const BASE_URL = REACT_APP_URL_APIGATEWAY; // Reemplaza esto con la URL de tu API

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
  }),
  endpoints: (builder) => ({
    get: builder.query<unknown, string>({
      query: (path) => path,
    }),
    post: builder.mutation<unknown, { path: string; datos: any }>({
      query: ({ path, datos }: { path: string; datos?: object | [] }) => ({
        url: path,
        method: 'POST',
        body: JSON.stringify(datos),
      }),
    }),
    put: builder.mutation<unknown, { path: string; id: string; datos: any }>({
      query: ({ path, id, datos }: { path: string; id: string; datos?: object | [] }) => ({
        url: id ? `${path}/${id}` : `${path}`,
        method: 'PUT',
        body: JSON.stringify(datos),
      }),
    }),
    delete: builder.mutation<unknown, { path: string; id?: string | null; datos?: any }>({
      query: ({ path, id, datos }) => ({
        url: id ? `${path}/${id}` : `${path}`,
        method: 'DELETE',
        body: JSON.stringify(datos),
      }),
    }),
  }),
});

export const { useGetQuery, usePostMutation, usePutMutation, useDeleteMutation }: any = api;
