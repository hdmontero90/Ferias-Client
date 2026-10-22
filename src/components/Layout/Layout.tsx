import { useEffect, useMemo } from "react";
import {
  AppShell,
  Group,
  Burger,
  Select,
  Text,
  Stack,
} from "@mantine/core";
import { NavLink as RouterLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { useGetQuery } from "../../Api/apiRTK";
import { useDisclosure } from "@mantine/hooks";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { establecerEdicion } from "../../Api/edicionSlice";
import { PublicFooter, type DatosPie } from "./PublicFooter";
import type { Edicion } from "../../interface/datos";

/** Estructura general del sitio público: cabecera con selector de edición,
 * menú de navegación, contenido (Outlet) y pie.
 * La edición vive en la URL (/:edicion) y se sincroniza con el store.
 * NOW: también muestra navbar y footer configurados por edición.
 */
export function Layout() {
  const [abierta, { toggle }] = useDisclosure(false);
  const { edicion } = useParams<{ edicion: string }>();
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const despachar = useAppDispatch();
  const edicionId = useAppSelector((state) => state.edicion.edicionId);

  const { data: datosEdiciones } = useGetQuery("/api/publico/ediciones") as {
    data?: { datos?: Edicion[] };
  };
  const ediciones = datosEdiciones?.datos ?? [];

  // La URL manda: sincroniza la edición del store.
  useEffect(() => {
    if (edicion && edicion !== edicionId) {
      despachar(establecerEdicion(edicion));
    }
  }, [edicion, edicionId, despachar]);

  // Edición efectiva para los links: URL si existe, si no la del store.
  const edicionEfectiva = edicion || edicionId;

  // NOW: obtener configuración del sitio público para esta edición
  // La respuesta de la API es { datos: {...}, edicion }: dos niveles de unwrap.
  const configNavDatos = useGetQuery("/api/publico/configuracion-sitio-publico/" + edicionEfectiva + "/nav")
    ?.data as { datos?: { nav_imagen_marca?: string | null; nav_enlaces?: Array<{ titulo: string; url: string }> } } | undefined;
  const configFooterDatos = useGetQuery("/api/publico/configuracion-sitio-publico/" + edicionEfectiva + "/footer")
    ?.data as { datos?: DatosPie } | undefined;

  // NOW: memoizar los datos de configuración
  const navLinksOptions = useMemo(() => {
    return configNavDatos?.datos?.nav_enlaces ?? [];
  }, [configNavDatos]);

  const navLinks = useMemo(() => {
    if (navLinksOptions && navLinksOptions.length > 0) {
      return navLinksOptions;
    }
    // Defaults: Inicio (/), Trabajos (/trabajos), Planos (/plan)
    return [
      { titulo: "Inicio", url: "/" },
      { titulo: "Trabajos", url: "/trabajos" },
      { titulo: "Planos", url: "/plan" },
    ];
  }, [navLinksOptions]);

  // NOW: render navbar links from config instead of hardcoded array
  const renderNavLinks = useMemo(() => {
    return navLinks.map((link) => {
      return (
        <RouterLink
          key={link.url}
          to={edicionEfectiva ? edicionEfectiva + link.url : link.url}
          onClick={() => abierta && toggle()}
          style={{ textDecoration: "none" }}
        >
          {link.titulo}
        </RouterLink>
      );
    });
  }, [navLinks, edicionEfectiva]);

  /** Navega a la misma sección pero en otra edición. */
  const alCambiarDeEdicion = (clave: string | null) => {
    if (!clave) return;
    // Quita el primer segmento (edición actual) y conserva el resto de la ruta.
    const segmentos = ubicacion.pathname.split("/").filter(Boolean);
    const resto = segmentos.slice(1).join("/");
    navegar(resto ? `/${clave}/${resto}` : `/${clave}`);
  };

  return (
    <>
      <AppShell
        header={{ height: 70 }}
        navbar={{ width: 260, breakpoint: "sm", collapsed: { desktop: !abierta, mobile: !abierta } }}
      >
        <AppShell.Header>
          <Group h="100%" px="md" justify="space-between" wrap="nowrap">
            <Group gap="sm" style={{ minWidth: 0 }}>
              <Burger
                opened={abierta}
                onClick={toggle}
                hiddenFrom="sm"
                size="sm"
                aria-label="Abrir menú"
              />
              <RouterLink to={edicionEfectiva ? `/${edicionEfectiva}` : "/"}>
                <Text fw={700} size="lg" truncate style={{ maxWidth: "50vw" }}>
                  Ferias de Ciencias
                </Text>
              </RouterLink>
            </Group>
            <Select
              label="Edición"
              placeholder="Elegí una edición"
              data={ediciones.map((e) => ({ value: e.clave, label: e.nombre || e.clave }))}
              value={edicionEfectiva || null}
              onChange={alCambiarDeEdicion}
              allowDeselect={false}
              w={220}
              size="sm"
              searchable
            />
          </Group>
        </AppShell.Header>

        <AppShell.Navbar>
          <Stack gap="xs">
            {renderNavLinks}
          </Stack>
        </AppShell.Navbar>

        <AppShell.Main>
          <Outlet />
        </AppShell.Main>

        <PublicFooter datos={configFooterDatos?.datos ?? null} />
      </AppShell>
    </>
  );
}
