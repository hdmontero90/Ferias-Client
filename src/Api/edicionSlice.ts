import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface EstadoEdicion {
  /** Clave natural de ediciones: "2024" | "2025" | "2026" ... */
  edicionId: string;
}

const estadoInicial: EstadoEdicion = {
  edicionId: "",
};

/**
 * Edición activa del sitio público. La URL (/:edicion) es la fuente de verdad;
 * este store sólo guarda el último valor conocido como fallback.
 */
const edicionSlice = createSlice({
  name: "edicion",
  initialState: estadoInicial,
  reducers: {
    establecerEdicion: (state, action: PayloadAction<string>) => {
      state.edicionId = action.payload;
    },
  },
});

export const { establecerEdicion } = edicionSlice.actions;
export default edicionSlice.reducer;
