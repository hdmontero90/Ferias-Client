export interface DocumentoLink {
  id: string;
  nombre: string;
  contenidoBase64: string;
  orden: number;
  activo: boolean;
}

export interface DocumentoLinkFormValues {
  nombre: string;
  contenidoBase64: string;
  activo: boolean;
}

export interface DocumentosResponse {
  success: boolean;
  data: DocumentoLink[];
  message?: string;
}

export interface DocumentoResponse {
  success: boolean;
  data: DocumentoLink;
  message?: string;
}