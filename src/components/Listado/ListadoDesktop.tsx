import { Title, Container, Text, NavLink } from "@mantine/core";
import { Link } from "react-router-dom";
import type { AdjudicacionEspecifica } from "../../interface/Compras";

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

interface ListadoDesktopProps {
  data: AdjudicacionEspecifica[];
}

export const ListadoDesktop = ({ data }: ListadoDesktopProps) => {
  return (
    <Container size="xl" py="md" fluid>
      <Title
        order={2}
        mb="lg"
        style={{
          color: `#228be6`,
          textDecoration: "underline",
        }}
        ta="left"
      >
        Información para proveedores
      </Title>

      {data.map((adjudicacion: AdjudicacionEspecifica) => {
        return (
          <div key={adjudicacion.publicacion_id}>
            <Text size="sm" color="#000">
              <NavLink
                label={adjudicacion.titulo}
                component={Link}
                to={"/detalle/" + adjudicacion.publicacion_id}
                styles={{
                  root: {
                    paddingLeft: 0,
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                  },
                  body: {
                    fontWeight: 400,
                  },
                }}
                c="#000"
              />
            </Text>
            <Text size="sm" color="#000">
              Tipo de Contratación:{" "}
              {getDisplayValue(
                "tipo_publicacion",
                adjudicacion.tipo_publicacion
              )}{" "}
              - Fecha de apertura: {adjudicacion.fecha_de_apertura} - Fecha de
              publicacion: {adjudicacion.fecha_de_publicacion} - Fecha de
              adjudicación: {adjudicacion.fecha_de_adjudicacion}
            </Text>
            <Text size="sm" color="dimmed">
              Objeto de la contratación: {adjudicacion.descripcion}
            </Text>
            <br />
          </div>
        );
      })}
    </Container>
  );
};
