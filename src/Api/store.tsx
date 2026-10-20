import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { api } from "./apiRTK";
import edicionReducer from "./edicionSlice";

const reductorRaiz = {
  [api.reducerPath]: api.reducer,
  edicion: edicionReducer,
};

export const store = configureStore({
  reducer: reductorRaiz,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);

export type EstadoRaiz = ReturnType<typeof store.getState>;
export type DespachoAplicacion = typeof store.dispatch;
export type AppStore = typeof store;
