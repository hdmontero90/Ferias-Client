import {
  Container,
  Title,
  Text,
  Paper,
  Group,
  Badge,
  Image,
  SimpleGrid,
  Stack,
  Divider,
  Button,
  Textarea,
  TextInput,
  Alert,
  Anchor,
  Center,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { Link, useParams } from "react-router-dom";
import { useGetQuery, usePostMutation } from "../Api/apiRTK";
import { useEdicionActual, conEdicion } from "../hooks/useEdicionActual";
import { Spinner } from "../components/Spinner/Spinner";
import type { TrabajoDetalle, Comentario } from "../interface/datos";

/** Detecta si una URL apunta a un video de YouTube y devuelve su ID embebible. */
function idVideoYouTube(url: string | null): string | null {
  if (!url) return null;
  const coincidencia = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  return coincidencia ? coincidencia[1] : null;
}

/** Detalle público de un trabajo con multimedia y comentarios. */
export function DetalleTrabajo() {
  const { id } = useParams<{ id: string }>();
  const edicion = useEdicionActual();
  const [enviarComentario, estadoEnvio] = usePostMutation();

  const { data, isLoading } = useGetQuery(
    id ? `/api/publico/trabajos/${id}` : "skip"
  ) as { data?: { datos?: TrabajoDetalle }; isLoading: boolean };

  const {
    data: datosComentarios,
    refetch: recargarComentarios,
  } = useGetQuery(id ? `/api/comentarios/trabajo/${id}` : "skip") as {
    data?: { datos?: Comentario[] };
    isLoading: boolean;
    refetch: () => void;
  };

  const form = useForm({
    initialValues: {
      nombre: "",
      email: "",
      comentario: "",
    },
    validate: {
      nombre: (valor) =>
        valor.trim().length < 3 ? "Ingresá tu nombre (mínimo 3 caracteres)" : null,
      email: (valor) =>
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z|a-z]{2,}$/.test(valor.trim())
          ? null
          : "Ingresá un email válido",
      comentario: (valor) =>
        valor.trim().length < 10
          ? "El comentario debe tener al menos 10 caracteres"
          : null,
    },
  });

  if (isLoading) return <Spinner />;

  const trabajo = data?.datos;
  if (!trabajo) {
    return (
      <Container size="lg" py="md">
        <Alert color="red" title="Trabajo no encontrado">
          El trabajo que buscás no existe o fue removido.{" "}
          <Anchor component={Link} to={conEdicion(edicion, "/trabajos")}>
            Volver al listado
          </Anchor>
        </Alert>
      </Container>
    );
  }

  const imagenes = [trabajo.imagen_1_url, trabajo.imagen_2_url, trabajo.imagen_3_url, trabajo.imagen_4_url].filter(
    (url): url is string => Boolean(url)
  );
  const videoId = idVideoYouTube(trabajo.url_youtube);
  const comentarios = datosComentarios?.datos ?? [];

  const alEnviarComentario = async (valores: typeof form.values) => {
    if (!id) return;
    try {
      await enviarComentario({
        ruta: "/api/comentarios",
        datos: {
          trabajo_id: id,
          comentario: valores.comentario.trim(),
          nombre: valores.nombre.trim(),
          email: valores.email.trim(),
        },
      }).unwrap();
      form.reset();
      notifications.show({
        title: "Comentario enviado",
        message: "Tu comentario quedó pendiente de aprobación.",
        color: "green",
      });
      recargarComentarios();
    } catch {
      notifications.show({
        title: "Error",
        message: "No se pudo enviar el comentario. Intentá nuevamente.",
        color: "red",
      });
    }
  };

  return (
    <Container size="lg" py="md">
      <Anchor component={Link} to={conEdicion(edicion, "/trabajos")} size="sm" mb="md" display="block">
        ← Volver a trabajos
      </Anchor>

      <Group gap={4} mb="xs">
        {trabajo.destacado && (
          <Badge color="yellow" variant="filled">
            Destacado
          </Badge>
        )}
        {trabajo.nivel_educativo_nombre && (
          <Badge variant="light">{trabajo.nivel_educativo_nombre}</Badge>
        )}
      </Group>

      <Title order={1} mb={4}>
        {trabajo.titulo}
      </Title>
      {trabajo.subtitulo && (
        <Text size="lg" c="dimmed" mb="md">
          {trabajo.subtitulo}
        </Text>
      )}

      {imagenes.length > 0 && (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="lg">
          {imagenes.map((url, indice) => (
            <Image
              key={url}
              src={url}
              alt={`${trabajo.titulo} - imagen ${indice + 1}`}
              radius="sm"
              fit="cover"
              h={320}
            />
          ))}
        </SimpleGrid>
      )}

      {videoId && (
        <Paper shadow="xs" p={0} mb="lg" style={{ overflow: "hidden" }}>
          <iframe
            width="100%"
            height="420"
            src={`https://www.youtube.com/embed/${videoId}`}
            title={`Video de ${trabajo.titulo}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ display: "block", border: 0 }}
          />
        </Paper>
      )}

      {trabajo.resumen && (
        <Text mb="lg" style={{ whiteSpace: "pre-wrap" }}>
          {trabajo.resumen}
        </Text>
      )}

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md" mb="lg">
        <Paper shadow="xs" p="md" withBorder>
          <Title order={4} mb="sm">
            Datos del trabajo
          </Title>
          <Stack gap={4}>
            {trabajo.establecimiento_nombre && (
              <Text size="sm">
                <strong>Establecimiento:</strong> {trabajo.establecimiento_nombre}
              </Text>
            )}
            {trabajo.jurisdiccion_nombre && (
              <Text size="sm">
                <strong>Jurisdicción:</strong> {trabajo.jurisdiccion_nombre}
              </Text>
            )}
            {trabajo.localidad_nombre && (
              <Text size="sm">
                <strong>Localidad:</strong> {trabajo.localidad_nombre}
              </Text>
            )}
            {trabajo.curso_sala_grado && (
              <Text size="sm">
                <strong>Curso / Sala / Grado:</strong> {trabajo.curso_sala_grado}
              </Text>
            )}
            {trabajo.cantidad_estudiantes_sala != null && (
              <Text size="sm">
                <strong>Estudiantes:</strong> {trabajo.cantidad_estudiantes_sala}
              </Text>
            )}
            {(trabajo.periodo_inicio || trabajo.periodo_fin) && (
              <Text size="sm">
                <strong>Período:</strong> {trabajo.periodo_inicio ? new Date(trabajo.periodo_inicio).toLocaleDateString("es-AR") : "?"} —{" "}
                {trabajo.periodo_fin ? new Date(trabajo.periodo_fin).toLocaleDateString("es-AR") : "?"}
              </Text>
            )}
          </Stack>
        </Paper>

        <Paper shadow="xs" p="md" withBorder>
          <Title order={4} mb="sm">
            Expositores
          </Title>
          {trabajo.expositores.length === 0 ? (
            <Text size="sm" c="dimmed">
              Sin expositores registrados.
            </Text>
          ) : (
            <Stack gap={4}>
              {trabajo.expositores.map((expositor) => (
                <Text key={`${expositor.persona_id}-${expositor.establecimiento_id}`} size="sm">
                  {expositor.apellido} {expositor.nombre}
                  {expositor.rol ? ` — ${expositor.rol}` : ""}
                </Text>
              ))}
            </Stack>
          )}
        </Paper>
      </SimpleGrid>

      <Group mb="lg">
        {trabajo.documento_url && (
          <Button
            component="a"
            href={trabajo.documento_url}
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
          >
            {trabajo.documento_nombre || "Descargar documento"}
          </Button>
        )}
        {trabajo.presentacion_url && (
          <Button
            component="a"
            href={trabajo.presentacion_url}
            target="_blank"
            rel="noopener noreferrer"
            variant="light"
          >
            {trabajo.presentacion_nombre || "Descargar presentación"}
          </Button>
        )}
      </Group>

      <Divider mb="md" />

      <Title order={3} mb="md">
        Comentarios ({comentarios.length})
      </Title>

      {comentarios.length === 0 ? (
        <Text c="dimmed" mb="md">
          Todavía no hay comentarios. ¡Sé el primero en dejar el tuyo!
        </Text>
      ) : (
        <Stack gap="md" mb="lg">
          {comentarios.map((comentario, indice) => (
            <Paper key={comentario.uuid || comentario.id || indice} shadow="xs" p="md" withBorder>
              <Group justify="space-between" mb={4}>
                <Text fw={700} size="sm">
                  {comentario.nombre}
                </Text>
                {comentario.created_at && (
                  <Text size="xs" c="dimmed">
                    {new Date(comentario.created_at).toLocaleDateString("es-AR")}
                  </Text>
                )}
              </Group>
              <Text size="sm" style={{ whiteSpace: "pre-wrap" }}>
                {comentario.comentario}
              </Text>
            </Paper>
          ))}
        </Stack>
      )}

      <Paper shadow="xs" p="md" withBorder>
        <Title order={4} mb="sm">
          Dejar un comentario
        </Title>
        <form onSubmit={form.onSubmit(alEnviarComentario)}>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md" mb="md">
            <TextInput
              label="Nombre"
              placeholder="Tu nombre"
              withAsterisk
              {...form.getInputProps("nombre")}
            />
            <TextInput
              label="Email"
              placeholder="tu@email.com"
              withAsterisk
              {...form.getInputProps("email")}
            />
          </SimpleGrid>
          <Textarea
            label="Comentario"
            placeholder="Escribí tu comentario (mínimo 10 caracteres)"
            minRows={4}
            withAsterisk
            mb="md"
            {...form.getInputProps("comentario")}
          />
          <Center>
            <Button type="submit" loading={estadoEnvio.isLoading}>
              Enviar comentario
            </Button>
          </Center>
        </form>
      </Paper>
    </Container>
  );
}
