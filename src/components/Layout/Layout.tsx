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

/** Elemento de una zona del pie según lo configurado en backoffice. */
interface ItemZonaPie {
  id: string;
  tipo: string;
  ref_id: string | null;
  texto: string | null;
}

/** Zona del pie: bloque vertical con alineación e items apilados en fila. */
interface ZonaPie {
  id: string;
  alineacion: string;
  items: ItemZonaPie[];
}

interface LayoutPie {
  zonas: ZonaPie[];
}

/** Logo configurable del pie (footer_logos). */
interface LogoPie {
  id: string;
  imagen: string;
  descripcion?: string | null;
  url?: string | null;
}

/** Enlace social configurable del pie (footer_enlaces). */
interface EnlaceRedPie {
  id: string;
  nombre: string;
  url: string;
  imagen?: string | null;
}

/** Config del pie publicada por /api/publico/configuracion-sitio-publico (en "datos"). */
interface ConfigFooter {
  footer_imagen_logo?: string | null;
  footer_enlaces?: EnlaceRedPie[];
  footer_logos?: LogoPie[] | null;
  footer_layout?: LayoutPie | null;
}

/* SVGs estáticos por nombre de red. Reutilizados por el pie por defecto y por
 * los items tipo "red" del layout configurado cuando el enlace no trae imagen. */
const IMAGENES_RED_POR_NOMBRE: Record<string, string> = {
  facebook: "/static/media/2025_Footer_1_Face.c1647929406c2ae53064fa660dd44460.svg",
  x: "/static/media/2025_Footer_1_X.5f6e0f60a5f0a55b354f833a06dd2a08.svg",
  instagram: "/static/media/2025_Footer_1_Instagram.b5d661bfa18be113ddaef14cc70574e1.svg",
  youtube: "/static/media/2025_Footer_1_Youtube.e9e268d21ee9311e4b9b4cea18cf19e2.svg",
};

/** Devuelve el SVG por defecto para el nombre de red dado (fallback: Facebook). */
const imagenDeRed = (nombre: string): string => {
  const clave = nombre.trim().toLowerCase();
  return IMAGENES_RED_POR_NOMBRE[clave] ?? IMAGENES_RED_POR_NOMBRE["facebook"];
};

/** alineación configurada -> justify-content del flex de la zona. */
const ALINEACION_FLEX: Record<string, string> = {
  izquierda: "flex-start",
  centro: "center",
  derecha: "flex-end",
};

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

  // NOW: obtener configuración del sitio público para esta edición.
  // El GET devuelve el cuerpo { datos: {...}, edicion } y useGetQuery expone
  // el body en data, por lo que la config real vive en data.datos.
  const configNavResult: { nav_links?: Array<{ titulo: string; url: string }> } =
    useGetQuery("/api/publico/configuracion-sitio-publico/" + edicionEfectiva + "/nav")?.data ?? {};
  const configFooterResult = (useGetQuery("/api/publico/configuracion-sitio-publico/" + edicionEfectiva + "/footer")?.data as { datos?: ConfigFooter } | undefined) ?? {};

  // NOW: memoizar los datos de configuración
  const navLinksOptions = useMemo(() => {
    return configNavResult.nav_links ?? [];
  }, [configNavResult]);

  // NOW: accesos directos a la config del pie (dentro de "datos").
  const footerLogoImagen = configFooterResult.datos?.footer_imagen_logo ?? null;
  const footerEnlacesConfig = configFooterResult.datos?.footer_enlaces ?? [];
  const footerLogosConfig = configFooterResult.datos?.footer_logos ?? null;
  const footerLayoutConfig = configFooterResult.datos?.footer_layout ?? null;

  const footerLinksOptions = useMemo(() => {
    return footerEnlacesConfig;
  }, [footerEnlacesConfig]);

  // NOW: memoizar los enlaces de navbar y footer a partir de la config o defaults
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

  // NOW: render del pie con layout configurado.
  // Sólo se usa si hay al menos una zona con al menos un item.
  const zonasActivas = useMemo(() => {
    return (footerLayoutConfig?.zonas ?? []).filter((zona) => zona.items.length > 0);
  }, [footerLayoutConfig]);
  const usarLayoutConfigurado = zonasActivas.length > 0;

  /** Render de un item de zona; devuelve null para no dejar imágenes rotas. */
  const renderItemDeZona = (item: ItemZonaPie) => {
    if (item.tipo === "texto") {
      // Texto plano: se omite si viene vacío.
      if (!item.texto) return null;
      return <span key={item.id}>{item.texto}</span>;
    }
    if (item.tipo === "logo") {
      const logo = footerLogosConfig?.find((l) => l.id === item.ref_id);
      // Si el logo no existe en footer_logos, se omite el item.
      if (!logo) return null;
      const img = (
        <img
          src={logo.imagen}
          alt={logo.descripcion || "Logo"}
          style={{ maxHeight: 48, width: "auto", display: "block" }}
        />
      );
      return logo.url ? (
        <a key={item.id} href={logo.url} target="_blank" rel="noreferrer">
          {img}
        </a>
      ) : (
        <span key={item.id} style={{ display: "inline-flex" }}>
          {img}
        </span>
      );
    }
    if (item.tipo === "red") {
      const enlace = footerEnlacesConfig.find((e) => e.id === item.ref_id);
      // Si el enlace no existe en footer_enlaces, se omite el item.
      if (!enlace) return null;
      return (
        <a
          key={item.id}
          href={enlace.url}
          target="_blank"
          rel="noreferrer"
          style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}
        >
          <img
            src={enlace.imagen || imagenDeRed(enlace.nombre)}
            alt={enlace.nombre}
            style={{ width: "100%", height: "100%" }}
          />
        </a>
      );
    }
    return null;
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

        <footer style={{ textAlign: "center", padding: "1.5rem", color: "#868e96" }}>
          {usarLayoutConfigurado ? (
            // NOW: pie con layout configurado — una fila por zona, alineación
            // según la zona y items resueltos contra footer_logos/footer_enlaces.
            zonasActivas.map((zona) => (
              <div
                key={zona.id}
                style={{
                  display: "flex",
                  justifyContent: ALINEACION_FLEX[zona.alineacion] ?? "flex-start",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 24,
                  marginTop: 12,
                }}
              >
                {zona.items.map(renderItemDeZona)}
              </div>
            ))
          ) : (
            // Pie por defecto: logo (o texto) centrado + fila de enlaces sociales.
            <div>
              {footerLogoImagen ? (
                <img
                  src={footerLogoImagen}
                  alt="Footer logo"
                  style={{ maxWidth: 200, height: "auto", display: "block", margin: "0 auto" }}
                />
              ) : (
                <Text size="sm" style={{ textAlign: "center", marginBottom: 8 }}>
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
                        src={link.imagen || imagenDeRed(link.nombre)}
                        alt={link.nombre}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </footer>
      </AppShell>
    </>
  );
}
