import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Paper,
  SimpleGrid,
  Group,
  TextInput,
  Badge,
  Alert,
  Button,
  Center,
} from "@mantine/core";
import { IconFileDownload, IconSearch } from "@tabler/icons-react";
import { useGetQuery } from "../Api/apiRTK";
import { useEdicionActual } from "../hooks/useEdicionActual";
import { Spinner } from "../components/Spinner/Spinner";
import { Paginador } from "../components/Paginador/Paginador";
import type { Material, Paginacion } from "../interface/datos";

/** URL de descarga de un material (documento subido o ruta externa). */
function urlDescarga(material: Material): string | null {
  return material.ruta_documento || material.documento || null;
}

/** Materiales descargables publicados en la edición actual. */
export function Materiales() {
  const edicion = useEdicionActual();
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);

  const ruta = edicion
    ? `/api/publico/materiales?edicion=${encodeURIComponent(edicion)}&pagina=${pagina}&porPagina=12${
        busqueda ? `&search=${encodeURIComponent(busqueda)}` : ""
      }`
    : "skip";

  const { data, isLoading } = useGetQuery(ruta) as {
    data?: { datos?: Material[]; paginacion?: Paginacion };
    isLoading: boolean;
  };

  if (isLoading && edicion) return <Spinner />;

  const materiales = data?.datos ?? [];
  const paginacion = data?.paginacion;

  return (
    <Container size="lg" py="md">
      <Title order={1} mb="md">
        Materiales
      </Title>

      <TextInput
        placeholder="Buscar materiales..."
        leftSection={<IconSearch size={16} />}
        value={busqueda}
        onChange={(evento) => {
          setBusqueda(evento.currentTarget.value);
          setPagina(1);
        }}
        mb="lg"
        maw={420}
      />

      {materiales.length === 0 ? (
        <Alert color="blue" title="Sin materiales">
          Esta edición aún no tiene materiales publicados.
        </Alert>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {materiales.map((material) => {
            const url = urlDescarga(material);
            return (
              <Paper key={material.id} shadow="xs" p="md" withBorder>
                <Group justify="space-between" align="flex-start" wrap="nowrap">
                  <Text fw={700} style={{ minWidth: 0 }} truncate>
                    {material.nombre}
                  </Text>
                  {material.tipo_documento_nombre && (
                    <Badge variant="light" style={{ flexShrink: 0 }}>
                      {material.tipo_documento_nombre}
                    </Badge>
                  )}
                </Group>
                {material.comentario && (
                  <Text size="sm" c="dimmed" mt={4}>
                    {material.comentario}
                  </Text>
                )}
                {url && (
                  <Button
                    component="a"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="light"
                    leftSection={<IconFileDownload size={16} />}
                    mt="sm"
                    fullWidth
                  >
                    Descargar
                  </Button>
                )}
              </Paper>
            );
          })}
        </SimpleGrid>
      )}

      {paginacion && (
        <Paginador
          pagina={paginacion.pagina}
          totalPaginas={paginacion.totalPaginas}
          alCambiarDePagina={setPagina}
        />
      )}

      <Center mt="lg">
        <Text size="sm" c="dimmed">
          {paginacion ? `${paginacion.total} materiales en total` : ""}
        </Text>
      </Center>
    </Container>
  );
}
