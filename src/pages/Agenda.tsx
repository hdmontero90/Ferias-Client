import { Container, Title, Text, Paper, Stack, Group, Badge, Alert } from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import { useGetQuery } from "../Api/apiRTK";
import { useEdicionActual } from "../hooks/useEdicionActual";
import { Spinner } from "../components/Spinner/Spinner";
import type { Evento, TextoAgenda } from "../interface/datos";

/** Formatea una fecha "YYYY-MM-DD" como "DD/MM/YYYY". */
function formatearFecha(fecha: string | null): string {
  if (!fecha) return "";
  const [anio, mes, dia] = fecha.slice(0, 10).split("-");
  return `${dia}/${mes}/${anio}`;
}

/**
 * Agenda pública de la edición: texto configurado en el backoffice
 * más el listado de eventos ordenado por fecha.
 */
export function Agenda() {
  const edicion = useEdicionActual();

  const { data: datosEventos, isLoading: cargandoEventos } = useGetQuery(
    edicion ? `/api/publico/eventos?edicion=${encodeURIComponent(edicion)}` : "skip"
  ) as { data?: { datos?: Evento[] }; isLoading: boolean };

  const { data: datosTexto } = useGetQuery(
    edicion ? `/api/publico/eventos/texto-agenda?edicion=${encodeURIComponent(edicion)}` : "skip"
  ) as { data?: { datos?: TextoAgenda | null } };

  if (cargandoEventos && edicion) return <Spinner />;

  const eventos = datosEventos?.datos ?? [];
  const textoAgenda = datosTexto?.datos;

  return (
    <Container size="lg" py="md">
      <Title order={1} mb="md">
        {textoAgenda?.titulo || "Agenda"}
      </Title>

      {textoAgenda?.texto && (
        <div
          dangerouslySetInnerHTML={{ __html: textoAgenda.texto }}
          style={{ marginBottom: "1.5rem" }}
        />
      )}

      {eventos.length === 0 ? (
        <Alert color="blue" title="Sin eventos">
          Esta edición aún no tiene eventos publicados.
        </Alert>
      ) : (
        <Stack gap="md">
          {eventos.map((evento) => (
            <Paper key={evento.id} shadow="xs" p="md" withBorder>
              <Group align="flex-start" wrap="nowrap">
                <IconCalendarEvent size={24} style={{ flexShrink: 0, marginTop: 4 }} />
                <div style={{ minWidth: 0 }}>
                  <Group gap="xs" mb={evento.descripcion ? 4 : 0}>
                    <Text fw={700}>{evento.titulo}</Text>
                    {evento.fecha_publicacion && (
                      <Badge variant="light">
                        {formatearFecha(evento.fecha_publicacion)}
                        {evento.hora_inicio ? ` — ${evento.hora_inicio}` : ""}
                        {evento.hora_fin ? ` a ${evento.hora_fin}` : ""}
                      </Badge>
                    )}
                  </Group>
                  {evento.descripcion && (
                    <Text
                      size="sm"
                      c="dimmed"
                      dangerouslySetInnerHTML={{ __html: evento.descripcion }}
                    />
                  )}
                  {evento.url && (
                    <Text
                      size="sm"
                      component="a"
                      href={evento.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      mt={4}
                      display="block"
                    >
                      Más información
                    </Text>
                  )}
                </div>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}
    </Container>
  );
}
