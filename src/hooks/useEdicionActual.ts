import { useParams } from "react-router-dom";
import { useAppSelector } from "./hooks";

/**
 * Edición efectiva del sitio público: la URL (/:edicion) manda,
 * el store es fallback.
 */
export function useEdicionActual(): string {
  const { edicion } = useParams<{ edicion: string }>();
  const edicionId = useAppSelector((state) => state.edicion.edicionId);
  return edicion || edicionId;
}

/**
 * Prefija un path absoluto con la edición actual.
 * conEdicion("2026", "/trabajos") => "/2026/trabajos".
 */
export function conEdicion(edicion: string, path: string): string {
  if (!edicion) return path;
  if (!path.startsWith("/")) return path;
  const segmento = path.split("/")[1] ?? "";
  if (!segmento || segmento === edicion) return path;
  return `/${edicion}${path}`;
}
