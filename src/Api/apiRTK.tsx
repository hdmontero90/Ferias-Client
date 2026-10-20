import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// URL base de la API. En dev, el proxy de Vite (/api -> localhost:5000) permite
// usar la raíz del sitio; en producción se puede definir VITE_URL_APIGATEWAY.
const URL_BASE_API = import.meta.env.VITE_URL_APIGATEWAY || "";

/**
 * API genérica del sitio público. El client no envía token: sólo consume
 * los endpoints públicos del server (/api/publico/* y comentarios).
 */
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: URL_BASE_API }),
  tagTypes: ["Api"],
  endpoints: (builder) => ({
    get: builder.query<unknown, string>({
      query: (ruta) => ruta,
      providesTags: ["Api"],
    }),
    getSinCache: builder.query<unknown, string>({
      query: (ruta) => ruta,
      keepUnusedDataFor: 0,
      providesTags: ["Api"],
    }),
    post: builder.mutation<unknown, { ruta: string; datos?: object }>({
      query: ({ ruta, datos }: { ruta: string; datos?: object }) => ({
        url: ruta,
        method: "POST",
        body: datos as object,
      }),
      invalidatesTags: ["Api"],
    }),
    delete: builder.mutation<unknown, { ruta: string; id?: string | null }>({
      query: ({ ruta, id }) => ({
        url: id ? `${ruta}/${id}` : `${ruta}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Api"],
    }),
  }),
});

export const {
  useGetQuery,
  useGetSinCacheQuery,
  usePostMutation,
  useDeleteMutation,
} = api;
