import { useState } from "react";
import {
  Container,
  Title,
  Text,
  Paper,
  SimpleGrid,
  Group,
  TextInput,
  Select,
  Badge,
  Image,
  Alert,
  Card,
  ActionIcon,
} from "@mantine/core";
import { IconSearch, IconArrowRight } from "@tabler/icons-react";
import { Link, useSearchParams } from "react-router-dom";
import { useGetQuery } from "../Api/apiRTK";
import { useEdicionActual, conEdicion } from "../hooks/useEdicionActual";
import { Spinner } from "../components/Spinner/Spinner";
import { Paginador } from "../components/Paginador/Paginador";
import type {
  TrabajoListado,
  Paginacion,
  NivelEducativo,
  Jurisdiccion,
} from "../interface/datos";

/** Listado público de trabajos de la edición, con filtros y paginación. */
export function Trabajos() {
  const edicion = useEdicionActual();
  const [parametrosBusqueda, setParametrosBusqueda] = useSearchParams();
  const [pagina, setPagina] = useState(1);

  const busqueda = parametrosBusqueda.get("busqueda") || "";
  const nivel = parametrosBusqueda.get("nivel") || "";
  const jurisdiccion = parametrosBusqueda.get("jurisdiccion") || "";

  const { data: datosNiveles } = useGetQuery("/api/publico/niveles-educativos") as {
    data?: { datos?: NivelEducativo[] };
  };
  const { data: datosJurisdicciones } = useGetQuery("/api/publico/jurisdicciones") as {
    data?: { datos?: Jurisdiccion[] };
  };

  const filtros = new URLSearchParams();
  if (edicion) filtros.set("edicion", edicion);
  filtros.set("pagina", String(pagina));
  filtros.set("porPagina", "12");
  if (busqueda) filtros.set("search", busqueda);
  if (nivel) filtros.set("nivel_educativo_id", nivel);
  if (jurisdiccion) filtros.set("jurisdiccion_id", jurisdiccion);

  const { data, isLoading } = useGetQuery(`/api/publico/trabajos?${filtros.toString()}`) as {
    data?: { datos?: TrabajoListado[]; paginacion?: Paginacion };
    isLoading: boolean;
  };

  if (isLoading && edicion) return <Spinner />;

  const trabajos = data?.datos ?? [];
  const paginacion = data?.paginacion;

  /** Actualiza un filtro y vuelve a la página 1. */
  const alFiltrar = (clave: string, valor: string) => {
    const nuevos = new URLSearchParams(parametrosBusqueda);
    if (valor) {
      nuevos.set(clave, valor);
    } else {
      nuevos.delete(clave);
    }
    setParametrosBusqueda(nuevos);
    setPagina(1);
  };

  return (
    <Container size="lg" py="md">
      <Title order={1} mb="md">
        Trabajos
      </Title>

      <Group mb="lg" align="flex-end">
        <TextInput
          placeholder="Buscar por título o resumen..."
          leftSection={<IconSearch size={16} />}
          value={busqueda}
          onChange={(evento) => alFiltrar("busqueda", evento.currentTarget.value)}
          style={{ flex: 1, minWidth: 200 }}
        />
        <Select
          placeholder="Nivel educativo"
          data={(datosNiveles?.datos ?? []).map((n) => ({ value: n.clave, label: n.nombre }))}
          value={nivel || null}
          onChange={(valor) => alFiltrar("nivel", valor || "")}
          clearable
          w={240}
        />
        <Select
          placeholder="Jurisdicción"
          data={(datosJurisdicciones?.datos ?? []).map((j) => ({
            value: j.clave,
            label: j.nombre,
          }))}
          value={jurisdiccion || null}
          onChange={(valor) => alFiltrar("jurisdiccion", valor || "")}
          clearable
          searchable
          w={240}
        />
      </Group>

      {trabajos.length === 0 ? (
        <Alert color="blue" title="Sin trabajos">
          No se encontraron trabajos con los filtros seleccionados.
        </Alert>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {trabajos.map((trabajo) => (
            <Card
              key={trabajo.id}
              shadow="xs"
              padding="md"
              radius="md"
              withBorder
              component={Link}
              to={conEdicion(edicion, `/trabajos/${trabajo.id}`)}
              style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}
            >
              {trabajo.imagen_1_url ? (
                <Image
                  src={trabajo.imagen_1_url}
                  alt={trabajo.titulo}
                  h={180}
                  fit="cover"
                  radius="sm"
                  mb="sm"
                />
              ) : (
                <Paper
                  h={180}
                  mb="sm"
                  radius="sm"
                  style={{
                    backgroundColor: "#f1f3f5",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text c="dimmed" size="sm">
                    Sin imagen
                  </Text>
                </Paper>
              )}
              <Group gap={4} mb={4}>
                {trabajo.destacado && (
                  <Badge color="yellow" variant="filled">
                    Destacado
                  </Badge>
                )}
                {trabajo.nivel_educativo_id && (
                  <Badge variant="light">{trabajo.nivel_educativo_id}</Badge>
                )}
              </Group>
              <Text fw={700} lineClamp={2}>
                {trabajo.titulo}
              </Text>
              {trabajo.subtitulo && (
                <Text size="sm" c="dimmed" lineClamp={2} mb={4}>
                  {trabajo.subtitulo}
                </Text>
              )}
              <Group gap="xs" mt="auto" pt="xs">
                {trabajo.jurisdiccion_nombre && (
                  <Text size="xs" c="dimmed">
                    {trabajo.jurisdiccion_nombre}
                  </Text>
                )}
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  aria-label="Ver detalle"
                  style={{ marginLeft: "auto" }}
                >
                  <IconArrowRight size={16} />
                </ActionIcon>
              </Group>
            </Card>
          ))}
        </SimpleGrid>
      )}

      {paginacion && (
        <Paginador
          pagina={paginacion.pagina}
          totalPaginas={paginacion.totalPaginas}
          alCambiarDePagina={(nueva) => {
            setPagina(nueva);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
    </Container>
  );
}
