import { Center, Pagination, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const Paginador = ({
  total,
  pagina_actual = 1,
  onChange,
}: {
  total: number;
  pagina_actual: number;
  onChange: (page: number) => void;
}) => {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  return (
    <Center h={100} px="sm">
      <Pagination
        total={total}
        size={isMobile ? "sm" : "xl"}
        withEdges
        value={pagina_actual}
        onChange={onChange}
        siblings={isMobile ? 0 : 1}
        boundaries={isMobile ? 0 : 1}
        styles={{
          control: {
            fontSize: isMobile ? theme.fontSizes.xs : theme.fontSizes.md,
          },
        }}
      />
    </Center>
  );
};

export default Paginador;
