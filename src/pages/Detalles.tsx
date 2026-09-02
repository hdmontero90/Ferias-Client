import { Container, useMantineTheme } from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import { useGetQuery } from "../Api/apiRTK";
import { Spinner } from "../components/Spinner/Spinner";
import Pag404 from "../components/404/Page404";
import type { AdjudicacionEspecifica } from "../interface/Compras";
import { useMediaQuery } from "@mantine/hooks";
import { DetalleMobile } from "../components/Detalle/DetalleMobile";
import { DetalleDesktop } from "../components/Detalle/DetalleDesktop";

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

const Detalle = () => {
  let params = useParams();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

  const { data, isLoading, error } = useGetQuery(
    `/api/licitaciones` + (!params ? "" : "/" + params.id)
  ) as {
    data?: { data: AdjudicacionEspecifica };
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

  return (
    <>
      {isMobile ? (
        <DetalleMobile data={data.data} />
      ) : (
        <DetalleDesktop data={data.data} />
      )}
    </>
  );
};

export default Detalle;