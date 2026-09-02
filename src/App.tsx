import { MantineProvider } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Listado from "./pages/Listado";
import Detalle from "./pages/Detalles";
import Adjudicaciones from "./pages/Adjudicaciones";
import DocumentosListado from "./pages/DocumentosListado";
import DocumentoDetalle from "./pages/DocumentoDetalle";
import { Provider } from "react-redux";
import { store } from "./Api/store";

import "@mantine/core/styles.css";
import Layout from "./components/Layout";
import { StrictMode } from "react";

function App() {
  return (
    <StrictMode>
      <Provider store={store}>
        <MantineProvider>
          <Router>
            <Routes>
              <Route path="" element={<Layout />}>
                <Route path="/" element={<Listado />} />
                <Route path="/adjudicaciones" element={<Adjudicaciones />} />
                <Route path="/documentos" element={<DocumentosListado />} />
              </Route>
              <Route path="/detalle/:id" element={<Detalle />} />
              <Route path="/documento/:id" element={<DocumentoDetalle />} />
            </Routes>
          </Router>
        </MantineProvider>
      </Provider>
    </StrictMode>
  );
}

export default App;
