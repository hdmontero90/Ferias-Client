import { useEffect } from "react";
import { Container, Title, Text, Paper, Alert } from "@mantine/core";
import { useLocation, useParams } from "react-router-dom";
import { useGetQuery, useGetSinCacheQuery } from "../Api/apiRTK";
import { useAppDispatch } from "../hooks/hooks";
import { establecerEdicion } from "../Api/edicionSlice";
import { useEdicionActual } from "../hooks/useEdicionActual";
import { Spinner } from "../components/Spinner/Spinner";
import type { Edicion, PaginaDinamica } from "../interface/datos";

/**
 * Página de inicio del sitio público: muestra el contenido editoriado
 * (página dinámica con slug "inicio", ambiente FRONTEND) de la edición actual.
 * Si la edición no tiene página de inicio, muestra una bienvenida por defecto.
 */
export function Inicio() {
  const { edicion: edicionUrl } = useParams<{ edicion: string }>();
  const ubicacion = useLocation();
  const despachar = useAppDispatch();
  const edicion = useEdicionActual();

  // Raíz sin edición: resolvemos la edición vigente en el server.
  const esRaiz = ubicacion.pathname === "/";
  const { data: edicionActiva } = useGetSinCacheQuery(
    esRaiz ? "/api/publico/ediciones/activa" : "skip"
  ) as { data?: { datos?: Edicion } };

  useEffect(() => {
    if (edicionUrl) {
      despachar(establecerEdicion(edicionUrl));
    } else if (esRaiz && edicionActiva?.datos) {
      despachar(establecerEdicion(edicionActiva.datos.clave));
    }
  }, [edicionUrl, esRaiz, edicionActiva, despachar]);

  const edicionEfectiva = edicionUrl ?? edicionActiva?.datos?.clave ?? edicion;

  const { data, isLoading } = useGetQuery(
    edicionEfectiva
      ? `/api/publico/paginas-dinamicas/inicio?edicion=${encodeURIComponent(edicionEfectiva)}`
      : "skip"
  ) as { data?: { datos?: PaginaDinamica; edicion?: string }; isLoading: boolean };

  if (isLoading && !edicionEfectiva) return <Spinner />;

  const pagina = data?.datos;

  return (
    <Container size="lg" py="md">
      {pagina ? (
        <>
          <Title order={1} mb="sm">
            {pagina.title}
          </Title>
          <div dangerouslySetInnerHTML={{ __html: pagina.body }} />
        </>
      ) : (
        <Paper shadow="xs" p="xl">
          <Title order={1} mb="sm" ta="center">
            Feria Nacional de Educación, Artes, Ciencias y Tecnología
          </Title>
          {edicionEfectiva && (
            <Text size="xl" ta="center" c="dimmed" mb="md">
              Edición {edicionEfectiva}
            </Text>
          )}
          <Alert color="blue" title="Contenido en preparación">
            La página de inicio de esta edición aún no fue publicada.
          </Alert>
        </Paper>
      )}
    </Container>
  );
}
