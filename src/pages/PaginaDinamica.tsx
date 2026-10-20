import { Container, Title, Alert } from "@mantine/core";
import { useParams } from "react-router-dom";
import { useGetQuery } from "../Api/apiRTK";
import { useEdicionActual } from "../hooks/useEdicionActual";
import { Spinner } from "../components/Spinner/Spinner";
import type { PaginaDinamica } from "../interface/datos";

/**
 * Renderizado de páginas dinámicas publicadas (ambiente FRONTEND) por slug
 * dentro de la edición activa. Es el catch-all del sitio público.
 */
export function PaginaDinamica() {
  const { "*" : slug } = useParams<{ "*": string }>();
  const edicion = useEdicionActual();

  const { data, isLoading } = useGetQuery(
    slug && edicion
      ? `/api/publico/paginas-dinamicas/${encodeURIComponent(slug)}?edicion=${encodeURIComponent(edicion)}`
      : "skip"
  ) as { data?: { datos?: PaginaDinamica }; isLoading: boolean };

  if (isLoading) return <Spinner />;

  const pagina = data?.datos;
  if (!pagina) {
    return (
      <Container size="lg" py="md">
        <Alert color="blue" title="Página no encontrada">
          La página que buscás no existe o no fue publicada en esta edición.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="md">
      <Title order={1} mb="md">
        {pagina.title}
      </Title>
      <div dangerouslySetInnerHTML={{ __html: pagina.body }} />
    </Container>
  );
}
