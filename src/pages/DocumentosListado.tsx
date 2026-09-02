import {
  Container,
  Title,
  Grid,
  Card,
  Text,
  Button,
  Alert,
  Group,
} from "@mantine/core";
import { IconAlertCircle, IconExternalLink } from "@tabler/icons-react";
import { useGetQuery } from "../Api/apiRTK";
import { Spinner } from "../components/Spinner/Spinner";
import type { DocumentoLink } from "../interface/DocumentoLink";

const DocumentosListado = () => {
  const { data, isLoading, error } = useGetQuery(`/api/documentos`) as {
    data?: DocumentoLink[];
    isLoading: boolean;
    error?: { status: number; data: unknown } | null;
  };

  const documentosActivos = data?.filter((doc) => doc.activo) || [];

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <Container size="xl" py="md">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          Error al cargar los documentos
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      <Title order={2} mb="xl">
        Documentos disponibles
      </Title>

      {documentosActivos.length === 0 ? (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Sin documentos"
          color="blue"
        >
          No hay documentos disponibles en este momento
        </Alert>
      ) : (
        <Grid>
          {documentosActivos.map((documento) => (
            <Grid.Col key={documento.id} span={{ base: 12, sm: 6, md: 4 }}>
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Text fw={500} size="lg" mb="sm">
                  {documento.nombre}
                </Text>

                <Group justify="flex-end" mt="md">
                  <Button
                    component="a"
                    href={documento.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    rightSection={<IconExternalLink size={16} />}
                  >
                    Ver documento
                  </Button>
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default DocumentosListado;
