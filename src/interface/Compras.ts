import type { DocumentoLink } from "./DocumentoLink";

export interface Filtros {
  anio: Record<string, number>;
  estado: Record<string, number>;
  tipo_publicacion: Record<string, number>;
  adjudicada: {
    true: number;
    false: number;
  };
}

export interface Documento {
  nombre: string;
  src: string;
}

export interface Renglon {
  proveedor: string;
  reglones: string;
  monto_total: number;
}

export interface Adjudicacion {
  expediente: string;
  titulo: string;
  descripcion: string;
  renglones: Renglon[];
  publicacion_id: string;
  tipo_publicacion: string;
  estado: string;
  anio: string;
  adjudicada: boolean;
  documentos: Documento[];
  fecha_de_apertura: string;
  fecha_de_publicacion: string;
  fecha_de_adjudicacion: string;
}

// Si quieres ser más específico con los valores posibles:
export interface AdjudicacionEspecifica {
  expediente: string;
  titulo: string;
  descripcion: string;
  renglones: Renglon[];
  publicacion_id: string;
  tipo_publicacion:
    | "concurso_privado"
    | "concurso_publico"
    | "contratacion_directa"
    | "licitacion_privada"
    | "licitacion_publica";
  estado: "vigentes" | "anteriores";
  anio: string;
  adjudicada: boolean;
  documentos: Documento[];
  fecha_de_apertura: string;
  fecha_de_publicacion: string;
  fecha_de_adjudicacion: string;
}

// Para el array completo de adjudicaciones:
export type AdjudicacionesArray = AdjudicacionEspecifica[];

export interface RespuestaAdjudicaciones {
  success: boolean;
  count: number;
  total: number;
  offset: number;
  limit: number;
  data: AdjudicacionesArray;
  filtros: Filtros;
  documentos?: DocumentoLink[]; // Documentos dinámicos
}
