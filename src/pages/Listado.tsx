import { Container, useMantineTheme } from "@mantine/core";
import Paginador from "../components/Paginador";
import { useLocation } from "react-router";
import { useGetQuery } from "../Api/apiRTK";
import { useState, useMemo } from "react";
import { Spinner } from "../components/Spinner/Spinner";
import Pag404 from "../components/404/Page404";
import type {
  AdjudicacionEspecifica,
  RespuestaAdjudicaciones,
} from "../interface/Compras";
import { useMediaQuery } from "@mantine/hooks";
import { ListadoMobile } from "../components/Listado/ListadoMobile";
import { ListadoDesktop } from "../components/Listado/ListadoDesktop";

// Definición de tipos para el mapeo
interface ValueMaps {
  tipo_publicacion: Record<string, string>;
  estado: Record<string, string>;
  adjudicada: Record<string, string>;
}

// Mapeo de valores técnicos a etiquetas descriptivas
const VALUE_MAPS: ValueMaps = {
  tipo_publicacion: {
    concurso_privado: "Concurso privado",
    concurso_publico: "Concurso público",
    contratacion_directa: "Contratación directa",
    licitacion_privada: "Licitación privada",
    licitacion_publica: "Licitación pública",
  },
  estado: {
    anterior: "Anteriores",
    vigente: "Vigentes",
  },
  adjudicada: {
    true: "Adjudicada",
    false: "No adjudicada",
  },
};

// Función para obtener la etiqueta descriptiva
const getDisplayValue = (key: keyof ValueMaps, value: string): string => {
  if (VALUE_MAPS[key] && VALUE_MAPS[key][value]) {
    return VALUE_MAPS[key][value];
  }
  return value;
};

const Listado = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  // Parsear los parámetros de filtro de la URL
  const filterParams = useMemo(() => {
    const searchParams = new URLSearchParams(location.search);
    const filters: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      if (key !== "limit" && key !== "offset") {
        filters[key] = value;
      }
    });

    return filters;
  }, [location.search]);

  // Construir la query string para la API
  const queryString = useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.set("limit", "10");
    searchParams.set("offset", String((currentPage - 1) * 10));

    // Agregar filtros
    Object.entries(filterParams).forEach(([key, value]) => {
      searchParams.set(key, value);
    });

    return searchParams.toString();
  }, [currentPage, filterParams]);

  const { data, isLoading, error } = useGetQuery(
    `/api/licitaciones?${queryString}`
  ) as {
    data?: RespuestaAdjudicaciones;
    isLoading: boolean;
    error: { status: number; data: unknown } | null;
  };

  if (error) {
    return <Pag404 />;
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (!data) {
    return null;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      {isMobile ? (
        <ListadoMobile data={data.data} />
      ) : (
        <ListadoDesktop data={data.data} />
      )}
      
      <Container size="xl" py="md" fluid>
        <br />
        <Paginador
          total={Math.ceil(data.total / 10)}
          pagina_actual={currentPage}
          onChange={handlePageChange}
        />
      </Container>
    </>
  );
};

export default Listado;
