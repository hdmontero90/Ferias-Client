import { Container, Drawer, ActionIcon, Grid, Box, Anchor } from "@mantine/core";
import { Outlet, Link } from "react-router-dom";
import Filtros from "./Filtros";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter, IconFiles } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

const Layout = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <Container size="xl" py="md">
        {/* Barra de navegación superior */}
        {/* <Box mb="md">
          <Anchor component={Link} to="/documentos" c="blue">
            <IconFiles size={16} style={{ marginRight: 8 }} />
            Documentos
          </Anchor>
        </Box>
         */}
        <Grid>
          {/* Contenido principal */}
          <Grid.Col span={isMobile ? 12 : 9}>
            <Outlet />
          </Grid.Col>
          {/* Sidebar con filtros (solo en desktop) */}
          {!isMobile && (
            <Grid.Col span={3}>
              <Filtros />
            </Grid.Col>
          )}
        </Grid>

        {/* Botón para abrir filtros en móvil */}
        {isMobile && (
          <ActionIcon
            variant="filled"
            color="blue"
            size="xl"
            radius="xl"
            onClick={open}
            style={{
              position: "fixed",
              bottom: 20,
              right: 20,
              zIndex: 1000,
            }}
          >
            <IconFilter size={24} />
          </ActionIcon>
        )}
      </Container>

      {/* Drawer para filtros en móvil */}
      {isMobile && (
        <Drawer
          opened={opened}
          onClose={close}
          title="Filtros"
          position="right"
          size="85%"
          styles={{
            content: {
              display: "flex",
              flexDirection: "column",
            },
            body: {
              flex: 1,
              overflowY: "auto",
            },
          }}
        >
          <Filtros mobileView onClose={close} />
        </Drawer>
      )}
    </>
  );
};

export default Layout;
