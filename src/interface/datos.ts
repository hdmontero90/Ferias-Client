/** Tipos compartidos del sitio público (nombres en castellano). */

export interface Edicion {
  clave: string;
  nombre: string;
  fecha_inicio: string | null;
  fecha_fin: string | null;
}

export interface Paginacion {
  total: number;
  totalPaginas: number;
  pagina: number;
  porPagina: number;
}

export interface TrabajoListado {
  id: string;
  uuid: string;
  titulo: string;
  subtitulo: string | null;
  resumen: string | null;
  destacado: boolean | null;
  url_youtube: string | null;
  imagen_1_url: string | null;
  imagen_2_url: string | null;
  imagen_3_url: string | null;
  imagen_4_url: string | null;
  nivel_educativo_id: string | null;
  curso_sala_grado: string | null;
  periodo_inicio: string | null;
  periodo_fin: string | null;
  created_at: string;
  jurisdiccion_id: string | null;
  jurisdiccion_nombre: string | null;
  establecimiento_nombre: string | null;
}

export interface Expositor {
  persona_id: string;
  establecimiento_id: string;
  rol: string | null;
  curso: string | null;
  apellido: string | null;
  nombre: string | null;
}

export interface TrabajoDetalle extends TrabajoListado {
  tipo_proyecto_id: string | null;
  subtipo_proyecto_id: string | null;
  sala_ciclo_id: string | null;
  eje_feria_id: string | null;
  foco_curricular_id: string | null;
  foco_complementario_1_id: string | null;
  foco_complementario_2_id: string | null;
  foco_transversal_id: string | null;
  orientacion_id: string | null;
  cantidad_estudiantes_sala: number | null;
  edicion_id: string | null;
  documento_url: string | null;
  documento_nombre: string | null;
  presentacion_url: string | null;
  presentacion_nombre: string | null;
  imagen_1_nombre: string | null;
  imagen_2_nombre: string | null;
  imagen_3_nombre: string | null;
  imagen_4_nombre: string | null;
  localidad_nombre: string | null;
  nivel_educativo_nombre: string | null;
  expositores: Expositor[];
}

export interface Evento {
  id: string;
  uuid: string;
  titulo: string;
  descripcion: string | null;
  url: string | null;
  fecha_publicacion: string | null;
  hora_inicio: string | null;
  hora_fin: string | null;
}

export interface TextoAgenda {
  edicion_id: string;
  titulo: string;
  texto: string;
}

export interface Material {
  id: string;
  nombre: string;
  comentario: string | null;
  tipo_documento_id: string | null;
  documento: string | null;
  ruta_documento: string | null;
  nombre_documento: string | null;
  tipo_documento_nombre: string | null;
}

export interface PaginaDinamica {
  slug: string;
  title: string;
  link: string | null;
  body: string;
  post_date: string | null;
}

export interface Comentario {
  uuid?: string;
  id?: string;
  trabajo_id: string;
  comentario: string;
  nombre: string;
  email: string;
  created_at?: string;
}

export interface NivelEducativo {
  clave: string;
  nombre: string;
}

export interface Jurisdiccion {
  clave: string;
  codigo: string;
  nombre: string;
}

export interface ConfiguracionSitioPublico {
  nav_imagen_marca: string;
  nav_enlaces: unknown[];
  footer_imagen_logo: string;
  footer_enlaces: unknown[];
  created_at: string;
  updated_at: string;
}
