import { Container, Card, Text, Button, Title, Center } from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";

/** Página 404 del sitio público. */
export function PaginaNoEncontrada() {
  const navegar = useNavigate();
  const ubicacion = useLocation();
  // Primer segmento de la URL: si existe, es la edición activa.
  const edicion = ubicacion.pathname.split("/")[1] || "";

  return (
    <Container
      fluid
      style={{
        minHeight: "calc(100vh - 9rem)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        padding="xl"
        radius="md"
        style={{
          textAlign: "center",
          maxWidth: "600px",
          boxShadow: "0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)",
        }}
      >
        <Center>
          <Title order={1} style={{ fontSize: "6rem", marginBottom: 0 }}>
            404
          </Title>
        </Center>
        <Text size="xl" fw={500} mt="md">
          La página que buscás no existe
        </Text>
        <Text c="dimmed" mt="xs">
          Verificá la dirección o volvé al inicio del sitio.
        </Text>
        <Center mt="lg">
          <Button
            size="md"
            onClick={() => navegar(edicion ? `/${edicion}` : "/")}
          >
            Volver al inicio
          </Button>
        </Center>
      </Card>
    </Container>
  );
}
