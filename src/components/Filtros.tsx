import { useNavigate, useLocation } from "react-router-dom";
import { useGetQuery } from "../Api/apiRTK";
import Pag404 from "./404/Page404";
import { Spinner } from "./Spinner/Spinner";
import type { RespuestaAdjudicaciones } from "../interface/Compras";
import type { DocumentoLink } from "../interface/DocumentoLink";
import { useMemo } from "react";
import { FiltrosMobile } from "./Filtros/FiltrosMobile";
import { FiltrosDesktop } from "./Filtros/FiltrosDesktop";

// Props para el componente Filtros
interface FiltrosProps {
  mobileView?: boolean;
  onClose?: () => void;
}

// Componente principal
const Filtros = ({ mobileView = false, onClose }: FiltrosProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Parsear parámetros de la URL
  const currentFilters = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const filters: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      if (key !== "limit") filters[key] = value;
    });

    return filters;
  }, [location.search]);

  // Construir query string para la API
  const queryString = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.set("limit", "10");

    Object.entries(currentFilters).forEach(([key, value]) => {
      searchParams.set(key, value);
    });

    return searchParams.toString();
  }, [currentFilters]);

  // Fetch data de licitaciones
  const { data, isLoading: isLoadingLicitaciones, error: errorLicitaciones } = useGetQuery(
    `/api/licitaciones?${queryString}`
  ) as {
    data?: RespuestaAdjudicaciones;
    isLoading: boolean;
    error: { status: number; data: unknown } | null;
  };

  // Fetch data de documentos
  const { data: documentosData, isLoading: isLoadingDocumentos, error: errorDocumentos } = useGetQuery(
    `/api/documentos`
  ) as {
    data?: DocumentoLink[];
    isLoading: boolean;
    error: { status: number; data: unknown } | null;
  };

  const removeFilter = (filterType: string) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete(filterType);

    if (filterType === "adjudicada" && location.pathname === "/adjudicaciones") {
      navigate(`/?${searchParams.toString()}`);
    } else {
      navigate(`${location.pathname}?${searchParams.toString()}`);
    }
  };

  const clearAllFilters = () => {
    navigate(location.pathname);
  };

  // Función para manejar clics en filtros en vista móvil
  const handleFilterClick = (url: string) => {
    navigate(url);
    if (onClose && mobileView) {
      onClose();
    }
  };

  // Estados de carga y error
  if (errorLicitaciones || errorDocumentos) return <Pag404 />;
  if (isLoadingLicitaciones || isLoadingDocumentos) return <Spinner />;
  if (!data || !documentosData) return null;

  // Combinar datos de licitaciones con documentos
  const combinedData = {
    ...data,
    documentos: documentosData.filter(doc => doc.activo) // Solo documentos activos
  };

  // Renderizar versión móvil o desktop
  if (mobileView) {
    return (
      <FiltrosMobile
        data={combinedData}
        currentFilters={currentFilters}
        removeFilter={removeFilter}
        clearAllFilters={clearAllFilters}
        handleFilterClick={handleFilterClick}
        location={location}
      />
    );
  }

  return (
    <FiltrosDesktop
      data={combinedData}
      currentFilters={currentFilters}
      removeFilter={removeFilter}
      clearAllFilters={clearAllFilters}
      location={location}
    />
  );
};

export default Filtros;