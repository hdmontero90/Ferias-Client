import {
  Title,
  Container,
  Box,
  useMantineTheme,
  ScrollArea,
  Text,
} from "@mantine/core";
import { Link } from "react-router-dom";
import type { AdjudicacionEspecifica } from "../../interface/Compras";

interface AdjudicacionesMobileProps {
  data: AdjudicacionEspecifica[];
}

export const AdjudicacionesMobile = ({ data }: AdjudicacionesMobileProps) => {
  const theme = useMantineTheme();

  return (
    <Container size="xl" py="md" fluid px="sm">
      <Title
        order={3}
        mb="lg"
        style={{
          color: `#228be6`,
          textDecoration: "underline",
        }}
        ta="center"
      >
        Adjudicaciones
      </Title>

      <ScrollArea>
        <Box>
          {data.map((adjudicacion: AdjudicacionEspecifica) => (
            <Box
              key={adjudicacion.expediente}
              mb="md"
              p="sm"
              style={{
                border: `1px solid ${theme.colors.blue[2]}`,
                borderRadius: theme.radius.md,
                backgroundColor: theme.white,
              }}
            >
              <Text fw={600} size="sm" mb="xs">
                Exp: {adjudicacion.expediente}
              </Text>
              <Text size="xs" color="dimmed" mb="xs" truncate>
                {adjudicacion.titulo}
              </Text>

              {adjudicacion.renglones.map((renglon, index) => (
                <Box
                  key={index}
                  mb="xs"
                  p="xs"
                  style={{
                    backgroundColor:
                      index % 2 === 0 ? theme.colors.gray[0] : "transparent",
                    borderRadius: theme.radius.sm,
                  }}
                >
                  <Text size="xs">
                    <Text component="span" fw={500}>
                      Proveedor:
                    </Text>{" "}
                    {renglon.proveedor}
                  </Text>
                  <Text size="xs">
                    <Text component="span" fw={500}>
                      Renglones:
                    </Text>{" "}
                    {renglon.reglones}
                  </Text>
                  <Text size="xs">
                    <Text component="span" fw={500}>
                      Monto:
                    </Text>{" "}
                    ${renglon.monto_total.toLocaleString("es-AR")}
                  </Text>
                </Box>
              ))}

              <Link
                to={`/detalle/${adjudicacion.publicacion_id}`}
                style={{
                  color: "#228be6",
                  textDecoration: "none",
                  fontSize: theme.fontSizes.xs,
                  display: "block",
                  textAlign: "center",
                  marginTop: theme.spacing.xs,
                }}
              >
                Ver detalle
              </Link>
            </Box>
          ))}
        </Box>
      </ScrollArea>
    </Container>
  );
};
