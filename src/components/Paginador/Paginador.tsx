import { Group, Button, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface PropiedadesPaginador {
  pagina: number;
  totalPaginas: number;
  alCambiarDePagina: (pagina: number) => void;
}

/** Paginador genérico del sitio público. */
export function Paginador({
  pagina,
  totalPaginas,
  alCambiarDePagina,
}: PropiedadesPaginador) {
  if (totalPaginas <= 1) return null;

  return (
    <Group justify="center" mt="xl" gap="xs">
      <Button
        variant="default"
        leftSection={<IconChevronLeft size={16} />}
        disabled={pagina <= 1}
        onClick={() => alCambiarDePagina(pagina - 1)}
      >
        Anterior
      </Button>
      <Text size="sm" c="dimmed" px="md">
        Página {pagina} de {totalPaginas}
      </Text>
      <Button
        variant="default"
        rightSection={<IconChevronRight size={16} />}
        disabled={pagina >= totalPaginas}
        onClick={() => alCambiarDePagina(pagina + 1)}
      >
        Siguiente
      </Button>
    </Group>
  );
}
