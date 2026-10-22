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
  const configNavResult: { nav_brand_image?: string; nav_links?: Array<{ titulo: string; url: string }> } =
    useGetQuery("/api/publico/configuracion-sitio-publico/" + edicionEfectiva + "/nav")?.data ?? {};
  const configFooterResult: { footer_logo_image?: string; footer_links?: Array<{ nombre: string; url: string; imagen?: string }> } =
    useGetQuery("/api/publico/configuracion-sitio-publico/" + edicionEfectiva + "/footer")?.data ?? {};

  // Color de fondo del pie configurado desde el backoffice (footer_color_fondo).
  // La respuesta de la API es { datos: {...}, edicion }: dos niveles de unwrap.
  const footerColorFondo: string | null =
    (useGetQuery("/api/publico/configuracion-sitio-publico/" + edicionEfectiva + "/footer")
      ?.data as { datos?: { footer_color_fondo?: string | null } } | undefined)
      ?.datos?.footer_color_fondo ?? null;

  // NOW: memoizar los datos de configuración
  const navLinksOptions = useMemo(() => {
    return configNavResult.nav_links ?? [];
  }, [configNavResult]);

  const footerLinksOptions = useMemo(() => {
    return configFooterResult.footer_links ?? [];
  }, [configFooterResult]);

  // Estilo del footer: si hay color de fondo configurado se aplica, junto con un
  // color de texto con contraste segun su luminancia. Sin color se usa el estilo actual.
  const estiloFooter: React.CSSProperties = (() => {
    const color = footerColorFondo?.trim() ?? "";
    const m = color !== "" ? /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(color) : null;
    if (!m) return { textAlign: "center", padding: "1.5rem", color: "#868e96" } as React.CSSProperties;
    const r = parseInt(m[0].slice(1, 3), 16);
    const g = parseInt(m[0].slice(3, 5), 16);
    const b = parseInt(m[0].slice(5, 7), 16);
    const clara = (0.299 * r + 0.587 * g + 0.114 * b) / 255 >= 0.6;
    return {
      textAlign: "center",
      padding: "1.5rem",
      backgroundColor: color,
      color: clara ? "#1a1b26" : "#ffffff",
    } as React.CSSProperties;
  })();

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

  const footerLinks = useMemo(() => {
    if (footerLinksOptions && footerLinksOptions.length > 0) {
      return footerLinksOptions;
    }
    // Defaults: Facebook, X, Instagram, YouTube
    return [
      { nombre: "Facebook", url: "https://www.facebook.com/MinisteriodeCapitalHumano", imagen: "/static/media/2025_Footer_1_Face.c1647929406c2ae53064fa660dd44460.svg" },
      { nombre: "X", url: "https://x.com/MinCapHum_Ar", imagen: "/static/media/2025_Footer_1_X.5f6e0f60a5f0a55b354f833a06dd2a08.svg" },
      { nombre: "Instagram", url: "https://www.instagram.com/mincapitalhumano/", imagen: "/static/media/2025_Footer_1_Instagram.b5d661bfa18be113ddaef14cc70574e1.svg" },
      { nombre: "YouTube", url: "https://www.youtube.com/@MinCapHum_Ar", imagen: "/static/media/2025_Footer_1_Youtube.e9e268d21ee9311e4b9b4cea18cf19e2.svg" },
    ];
  }, [footerLinksOptions]);

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

        <footer style={estiloFooter}>
          <div>
            {configFooterResult.footer_logo_image ? (
              <img
                src={configFooterResult.footer_logo_image}
                alt="Footer logo"
                style={{ maxWidth: 200, height: "auto", display: "block", margin: "0 auto" }}
              />
            ) : (
              <Text size="sm" style={{ textAlign: "center", marginBottom: 8, color: "inherit" }}>
                Ferias Nacionales de Educación, Artes, Ciencias y Tecnología
              </Text>
            )}

            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12 }}>
              {footerLinks.map((link) => {
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <img
                      src={link.imagen || "/static/media/2025_Footer_1_Face.c1647929406c2ae53064fa660dd44460.svg"}
                      alt={link.nombre}
                      style={{ width: "100%", height: "100%" }}
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </footer>
      </AppShell>
    </>
  );
}
