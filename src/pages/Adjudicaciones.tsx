import { Container, useMantineTheme } from "@mantine/core";
import Paginador from "../components/Paginador";
import { useLocation } from "react-router-dom";
import { useGetQuery } from "../Api/apiRTK";
import { useState, useMemo } from "react";
import { Spinner } from "../components/Spinner/Spinner";
import Pag404 from "../components/404/Page404";
import {
  type AdjudicacionEspecifica,
  type RespuestaAdjudicaciones,
} from "../interface/Compras";
import { useMediaQuery } from "@mantine/hooks";
import { AdjudicacionesMobile } from "../components/Adjudicaciones/AdjudicacionesMobile";
import { AdjudicacionesDesktop } from "../components/Adjudicaciones/AdjudicacionesDesktop";

const Adjudicaciones = () => {
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
    searchParams.set("limit", isMobile ? "5" : "10");
    searchParams.set("offset", String((currentPage - 1) * (isMobile ? 5 : 10)));
    searchParams.set("adjudicada", "true"); // Siempre filtrar por adjudicada=true

    // Agregar otros filtros
    Object.entries(filterParams).forEach(([key, value]) => {
      if (key !== "adjudicada") {
        // Evitar duplicar adjudicada
        searchParams.set(key, value);
      }
    });

    return searchParams.toString();
  }, [currentPage, filterParams, isMobile]);

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
        <AdjudicacionesMobile data={data.data} />
      ) : (
        <AdjudicacionesDesktop data={data.data} />
      )}

      <Container size="xl" py="md" fluid px={isMobile ? "sm" : "md"}>
        <br />
        <Paginador
          total={Math.ceil(data.total / (isMobile ? 5 : 10))}
          pagina_actual={currentPage}
          onChange={handlePageChange}
        />
      </Container>
    </>
  );
};

export default Adjudicaciones;
