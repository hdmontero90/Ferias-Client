import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./Api/store";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { StrictMode } from "react";
import { Layout } from "./components/Layout/Layout";
import { Spinner } from "./components/Spinner/Spinner";
import { PaginaNoEncontrada } from "./components/404/PaginaNoEncontrada";
import { Inicio } from "./pages/Inicio";
import { Trabajos } from "./pages/Trabajos";
import { DetalleTrabajo } from "./pages/DetalleTrabajo";
import { Agenda } from "./pages/Agenda";
import { Materiales } from "./pages/Materiales";
import { PaginaDinamica } from "./pages/PaginaDinamica";
import { useGetSinCacheQuery } from "./Api/apiRTK";
import type { Edicion } from "./interface/datos";

/**
 * Raíz del sitio: resuelve la edición vigente en el server
 * y redirige a /:edicion.
 */
function RedirigirEdicionVigente() {
  const { data, isLoading } = useGetSinCacheQuery("/api/publico/ediciones/activa") as {
    data?: { datos?: Edicion };
    isLoading: boolean;
  };
  if (isLoading) return <Spinner />;
  const edicion = data?.datos?.clave;
  return edicion ? <Navigate to={`/${edicion}`} replace /> : <PaginaNoEncontrada />;
}

/**
 * Compatibilidad con urls viejas sin edición (/trabajos, /agenda, ...)
 * que redirigen a la edición vigente.
 */
function RedirigirConEdicionVigente() {
  const ubicacion = useLocation();
  const { data, isLoading } = useGetSinCacheQuery("/api/publico/ediciones/activa") as {
    data?: { datos?: Edicion };
    isLoading: boolean;
  };
  if (isLoading) return <Spinner />;
  const edicion = data?.datos?.clave;
  // Conserva el resto de la ruta (ej: /trabajos/abc -> trabajos/abc).
  const resto = ubicacion.pathname.replace(/^\//, "");
  return edicion ? (
    <Navigate to={`/${edicion}${resto ? `/${resto}` : ""}`} replace />
  ) : (
    <PaginaNoEncontrada />
  );
}

function App() {
  return (
    <StrictMode>
      <Provider store={store}>
        <MantineProvider>
          <Notifications position="top-right" zIndex={10000} />
          <Router>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<RedirigirEdicionVigente />} />
                <Route path=":edicion">
                  <Route index element={<Inicio />} />
                  <Route path="trabajos" element={<Trabajos />} />
                  <Route path="trabajos/:id" element={<DetalleTrabajo />} />
                  <Route path="agenda" element={<Agenda />} />
                  <Route path="materiales" element={<Materiales />} />
                  {/* Páginas dinámicas publicadas (catch-all bajo la edición) */}
                  <Route path="*" element={<PaginaDinamica />} />
                </Route>
              </Route>
              {/* Compatibilidad: urls viejas sin edición */}
              <Route path="/trabajos" element={<RedirigirConEdicionVigente />} />
              <Route path="/trabajos/:id" element={<RedirigirConEdicionVigente />} />
              <Route path="/agenda" element={<RedirigirConEdicionVigente />} />
              <Route path="/materiales" element={<RedirigirConEdicionVigente />} />
              <Route path="*" element={<PaginaNoEncontrada />} />
            </Routes>
          </Router>
        </MantineProvider>
      </Provider>
    </StrictMode>
  );
}

export default App;
