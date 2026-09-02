import {
  Title,
  Text,
  Container,
  Button,
  List,
  Box,
  useMantineTheme,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import type { AdjudicacionEspecifica } from "../../interface/Compras";

// Definición de tipos para el mapeo
interface ValueMaps {
  tipo_publicacion: Record<string, string>;
  estado: Record<string, string>;
  adjudicada: Record<string, string>;
}

// Mapeo de valores técnicos a etiquetas descriptivas
const VALUE_MAPS: ValueMaps = {
  tipo_publicacion: {
    concurso_privado: "Concurso privado",
    concurso_publico: "Concurso público",
    contratacion_directa: "Contratación directa",
    licitacion_privada: "Licitación privada",
    licitacion_publica: "Licitación pública",
  },
  estado: {
    anterior: "Anteriores",
    vigente: "Vigentes",
  },
  adjudicada: {
    true: "Adjudicada",
    false: "No adjudicada",
  },
};

// Función para obtener la etiqueta descriptiva
const getDisplayValue = (key: keyof ValueMaps, value: string): string => {
  if (VALUE_MAPS[key] && VALUE_MAPS[key][value]) {
    return VALUE_MAPS[key][value];
  }
  return value;
};

interface DetalleDesktopProps {
  data: AdjudicacionEspecifica;
}

export const DetalleDesktop = ({ data }: DetalleDesktopProps) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Esto vuelve a la página anterior en el historial
  };

  return (
    <Container size="xl" py="md" px="md">
      <Title
        order={2}
        mb="lg"
        style={{
          color: `#228be6`,
          textDecoration: "underline",
        }}
        ta="left"
      >
        Información para proveedores
      </Title>

      <Box mb="xl">
        <Text size="lg" fw={600} color="#000" mb="md">
          {data.titulo}
        </Text>

        <Text size="sm" color="dimmed" mb="sm">
          <Text component="span" fw={500}>
            Tipo de Contratación:
          </Text>{" "}
          {getDisplayValue("tipo_publicacion", data.tipo_publicacion)}
        </Text>

        <Text size="sm" color="dimmed" mb="sm">
          <Text component="span" fw={500}>
            Fecha de apertura:
          </Text>{" "}
          {data.fecha_de_apertura}
        </Text>

        <Text size="sm" color="dimmed" mb="sm">
          <Text component="span" fw={500}>
            Fecha de publicación:
          </Text>{" "}
          {data.fecha_de_publicacion}
        </Text>

        <Text size="sm" color="dimmed" mb="sm">
          <Text component="span" fw={500}>
            Fecha de adjudicación:
          </Text>{" "}
          {data.fecha_de_adjudicacion}
        </Text>

        <Text size="sm" color="dimmed" mb="sm">
          <Text component="span" fw={500}>
            Expediente N°:
          </Text>{" "}
          {data.expediente} -{" "}
          <Text component="span" fw={500}>
            Año:
          </Text>{" "}
          {data.anio}
        </Text>

        <Text size="sm" color="dimmed" mb="sm">
          <Text component="span" fw={500}>
            Estado:
          </Text>{" "}
          {getDisplayValue("estado", data.estado)}
        </Text>

        <Text size="sm" color="dimmed" mb="md">
          <Text component="span" fw={500}>
            Objeto de la contratación:
          </Text>{" "}
          {data.descripcion}
        </Text>
      </Box>

      <Box mb="xl">
        <Text size="lg" fw={600} mb="md" color="#000">
          Archivos para descargar:
        </Text>
        <List spacing="sm" withPadding={false}>
          {data && data.documentos ? (
            <>
              {data.documentos.map((documento: any, index: number) => {
                return (
                  <List.Item key={index}>
                    <a
                      href={documento.contenidoBase64}
                      style={{
                        color: "#228be6",
                        fontSize: theme.fontSizes.md,
                        wordBreak: "break-word",
                      }}
                      download={documento.nombre}
                    >
                      {documento.nombre}
                    </a>
                  </List.Item>
                );
              })}
            </>
          ) : (
            <Text size="sm" color="dimmed">
              No hay documentos disponibles
            </Text>
          )}
        </List>
      </Box>

      <Button
        variant="filled"
        onClick={handleGoBack}
        fullWidth={false}
        size="lg"
      >
        Volver al listado
      </Button>
    </Container>
  );
};
