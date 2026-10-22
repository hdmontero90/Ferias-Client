import { useMemo, type CSSProperties } from "react";

/** Pie de página público con la misma estructura que el organizador del backoffice:
 * filas ("zonas principales") de columnas con elementos. Sin layout configurado,
 * muestra el diseño clásico (logo/lema + redes por defecto). */

interface ItemPie {
  id: string;
  tipo: "logo" | "red" | "texto" | "enlace";
  ref_id: string;
  texto?: string | null;
  nombre?: string | null;
  url?: string | null;
}

interface ColumnaPie {
  id: string;
  alineacion: "izquierda" | "centro" | "derecha";
  items?: ItemPie[] | null;
}

interface FilaPie {
  id: string;
  columnas?: ColumnaPie[] | null;
}

export interface DatosPie {
  footer_imagen_logo?: string | null;
  footer_logos?: { id: string; imagen?: string | null; descripcion?: string | null; url?: string | null }[] | null;
  footer_enlaces?: { id?: string | null; nombre: string; url: string; imagen?: string | null }[] | null;
  // El layout puede llegar en formato filas (actual) o zonas sueltas (legacy).
  footer_layout?: { filas?: FilaPie[] | null } | { zonas?: ColumnaPie[] | null } | null;
  footer_color_fondo?: string | null;
  footer_color_texto?: string | null;
}

function justifyDeAlineacion(alineacion: string): CSSProperties {
  if (alineacion === "centro") return { justifyContent: "center" };
  if (alineacion === "derecha") return { justifyContent: "flex-end" };
  return { justifyContent: "flex-start" };
}

/** Normaliza el layout guardado: filas actuales o zonas legacy (una fila por zona). */
function normalizarFilas(layout: DatosPie["footer_layout"]): FilaPie[] {
  if (!layout || typeof layout !== "object") return [];
  const filas = (layout as { filas?: FilaPie[] }).filas;
  if (Array.isArray(filas)) {
    return filas.filter(
      (fila) => fila && Array.isArray(fila.columnas)
    );
  }
  const zonas = (layout as { zonas?: ColumnaPie[] }).zonas;
  if (Array.isArray(zonas)) {
    return zonas
      .filter((zona) => zona && Array.isArray(zona.items))
      .map((zona) => ({ id: `f-${zona.id}`, columnas: [zona] }));
  }
  return [];
}

/** Un layout vacío (sin filas o sin items) muestra el diseño clásico. */
function esLayoutVacio(filas: FilaPie[]): boolean {
  return filas.every(
    (fila) =>
      !fila.columnas?.some((columna) => Array.isArray(columna.items) && columna.items.length > 0)
  );
}

const COLORES_RED: Record<string, string> = {
  facebook: "#1877f2",
  instagram: "#e4405f",
  x: "#000000",
  youtube: "#ff0000",
};

/** Redes por defecto del pie clásico mientras no haya enlaces configurados. */
const REDES_POR_DEFECTO = [
  { nombre: "Facebook", url: "https://www.facebook.com/MinisteriodeCapitalHumano", imagen: "/static/media/2025_Footer_1_Face.c1647929406c2ae53064fa660dd44460.svg" },
  { nombre: "X", url: "https://x.com/MinCapHum_Ar", imagen: "/static/media/2025_Footer_1_X.5f6e0f60a5f0a55b354f833a06dd2a08.svg" },
  { nombre: "Instagram", url: "https://www.instagram.com/mincapitalhumano/", imagen: "/static/media/2025_Footer_1_Instagram.b5d661bfa18be113ddaef14cc70574e1.svg" },
  { nombre: "YouTube", url: "https://www.youtube.com/@MinCapHum_Ar", imagen: "/static/media/2025_Footer_1_Youtube.e9e268d21ee9311e4b9b4cea18cf19e2.svg" },
];

// Misma resolución de raíz que usa el cliente de API (VITE_URL_APIGATEWAY).
const API_BASE = import.meta.env.VITE_URL_APIGATEWAY || "";

/** Resuelve la URL de una imagen: absoluta o recurso propio tal cual; ruta subida
 * al backend (/uploads) prefijada con la base de la API; lo demás no es una imagen. */
function resolverUrlImagen(valor: string | undefined | null): string | null {
  if (!valor) return null;
  if (valor.startsWith("http") || valor.startsWith("blob:")) return valor;
  // /static/media son recursos incluidos en el propio client.
  if (valor.startsWith("/static/")) return valor;
  if (valor.startsWith("/uploads")) return API_BASE + valor;
  return null;
}

function esUrlImagen(valor: string | undefined | null): boolean {
  return resolverUrlImagen(valor) !== null;
}

function ItemPieVista({
  item,
  logos,
  enlaces,
}: {
  item: ItemPie;
  logos: NonNullable<DatosPie["footer_logos"]>;
  enlaces: NonNullable<DatosPie["footer_enlaces"]>;
}) {
  if (item.tipo === "logo") {
    const logo = logos.find((l) => l.id === item.ref_id);
    const urlLogo = resolverUrlImagen(logo?.imagen);
    if (!urlLogo) return null;
    return (
      <img
        src={urlLogo}
        alt={logo?.descripcion || "Logo"}
        title={logo?.descripcion || undefined}
        style={{ maxHeight: 40, maxWidth: 120, objectFit: "contain", display: "block" }}
      />
    );
  }
  if (item.tipo === "red") {
    const red = enlaces.find((r) => r.id === item.ref_id);
    if (!red) return null;
    if (esUrlImagen(red.imagen)) {
      return (
        <a href={red.url} target="_blank" rel="noreferrer" title={red.nombre}>
          <img
            src={resolverUrlImagen(red.imagen) as string}
            alt={red.nombre}
            style={{ width: 24, height: 24, objectFit: "contain", display: "block" }}
          />
        </a>
      );
    }
    const colorFondo = COLORES_RED[(red.imagen || red.nombre || "").toLowerCase()] ?? "#adb5bd";
    const inicial = (red.nombre || "?").charAt(0).toUpperCase();
    return (
      <a
        href={red.url}
        target="_blank"
        rel="noreferrer"
        title={red.nombre}
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          backgroundColor: colorFondo,
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 13,
          fontWeight: 600,
          textDecoration: "none",
        }}
      >
        {inicial}
      </a>
    );
  }
  if (item.tipo === "enlace") {
    if (!item.nombre) return null;
    return (
      <a
        href={item.url || "#"}
        target="_blank"
        rel="noreferrer"
        style={{
          color: "inherit",
          fontSize: 14,
          textDecoration: "underline",
          whiteSpace: "nowrap",
        }}
      >
        {item.nombre}
      </a>
    );
  }
  return (
    <span style={{ fontSize: 14, whiteSpace: "nowrap" }}>{item.texto}</span>
  );
}

/** Fila/columnas del pie configuradas, con los colores del organizador. */
function PieConLayout({
  filas,
  logos,
  enlaces,
  colorFondo,
  colorTexto,
}: {
  filas: FilaPie[];
  logos: NonNullable<DatosPie["footer_logos"]>;
  enlaces: NonNullable<DatosPie["footer_enlaces"]>;
  colorFondo: string | null;
  colorTexto: string | null;
}) {
  const estilo: CSSProperties = (() => {
    const fondo = (colorFondo ?? "").trim();
    const m = fondo !== "" ? /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(fondo) : null;
    const colorTextoElegido = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test((colorTexto ?? "").trim())
      ? (colorTexto ?? "").trim()
      : null;
    if (m) {
      const r = parseInt(m[0].slice(1, 3), 16);
      const g = parseInt(m[0].slice(3, 5), 16);
      const b = parseInt(m[0].slice(5, 7), 16);
      const contraste = (0.299 * r + 0.587 * g + 0.114 * b) / 255 >= 0.6 ? "#1a1b26" : "#ffffff";
      return {
        textAlign: "center",
        padding: "1.5rem",
        backgroundColor: fondo,
        color: colorTextoElegido ?? contraste,
      };
    }
    return {
      textAlign: "center",
      padding: "1.5rem",
      color: colorTextoElegido ?? "#868e96",
    };
  })();

  return (
    <footer style={estilo}>
      <StackFilas filas={filas} logos={logos} enlaces={enlaces} />
    </footer>
  );
}

function StackFilas({
  filas,
  logos,
  enlaces,
}: {
  filas: FilaPie[];
  logos: NonNullable<DatosPie["footer_logos"]>;
  enlaces: NonNullable<DatosPie["footer_enlaces"]>;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {filas.map((fila) => (
        <div
          key={fila.id}
          style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "flex-start" }}
        >
          {fila.columnas
            ?.filter((columna) => Array.isArray(columna.items) && columna.items.length > 0)
            .map((columna) => (
              <div
                key={columna.id}
                style={{
                  flex: 1,
                  minWidth: 160,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 14,
                  alignItems: "center",
                  ...justifyDeAlineacion(
                    columna.alineacion === "izquierda" ||
                      columna.alineacion === "centro" ||
                      columna.alineacion === "derecha"
                      ? columna.alineacion
                      : "centro"
                  ),
                }}
              >
                {columna.items!.map((item) => (
                  <ItemPieVista key={item.id} item={item} logos={logos} enlaces={enlaces} />
                ))}
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

/** Pie clásico: logo configurado (o lema) + redes configuradas (o las 4 por defecto). */
function PieClasico({
  datos,
  enlaces,
}: {
  datos: DatosPie;
  enlaces: NonNullable<DatosPie["footer_enlaces"]>;
}) {
  return (
    <footer style={{ textAlign: "center", padding: "1.5rem", color: "#868e96" }}>
      <div>
        {esUrlImagen(datos.footer_imagen_logo) ? (
          <img
            src={resolverUrlImagen(datos.footer_imagen_logo) as string}
            alt="Logo del pie"
            style={{ maxWidth: 200, height: "auto", display: "block", margin: "0 auto" }}
          />
        ) : (
          <p style={{ fontSize: 14, margin: "0 0 8px" }}>
            Ferias Nacionales de Educación, Artes, Ciencias y Tecnología
          </p>
        )}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12 }}>
          {enlaces.map((red) => (
            <a
              key={red.nombre}
              href={red.url}
              target="_blank"
              rel="noreferrer"
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={
                  esUrlImagen(red.imagen)
                    ? (red.imagen as string)
                    : REDES_POR_DEFECTO.find((r) => r.nombre === red.nombre)?.imagen
                }
                alt={red.nombre}
                style={{ width: "100%", height: "100%" }}
              />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export function PublicFooter({ datos }: { datos: DatosPie | null }) {
  const filas = useMemo(() => normalizarFilas(datos?.footer_layout ?? null), [datos]);
  const logos = useMemo(() => datos?.footer_logos ?? [], [datos]);
  const enlaces = useMemo(() => {
    const propias = datos?.footer_enlaces ?? [];
    return propias.length > 0 ? propias : REDES_POR_DEFECTO;
  }, [datos]);

  if (!esLayoutVacio(filas)) {
    return <PieConLayout filas={filas} logos={logos} enlaces={enlaces} colorFondo={datos?.footer_color_fondo ?? null} colorTexto={datos?.footer_color_texto ?? null} />;
  }
  return <PieClasico datos={datos ?? {}} enlaces={enlaces} />;
}
