import {
  Container,
  Text,
  Title,
  NavLink,
  Divider,
  Badge,
  Group,
  ActionIcon
} from "@mantine/core";
import { Link, useNavigate } from "react-router-dom";
import { IconFileDownload, IconEye } from "@tabler/icons-react";
import type { RespuestaAdjudicaciones } from "../../interface/Compras";
import type { DocumentoLink } from "../../interface/DocumentoLink";
import { downloadBase64PDF } from "../../utils/base64PDF";

// Interfaces y tipos
interface FilterOption {
  label: string;
  value: string;
  key: string;
}

interface FilterMaps {
  tipo_publicacion: Record<string, string>;
  estado: Record<string, string>;
  adjudicada: Record<string, string>;
  key: Record<string, string>;
}

interface FiltrosData extends RespuestaAdjudicaciones {
  filtros: {
    tipo_publicacion: Record<string, number>;
    estado: Record<string, number>;
    anio: Record<string, number>;
    adjudicada: { true: number; false: number };
  };
  documentos: DocumentoLink[];
}

// Constantes y mapeos
const FILTER_MAPS: FilterMaps = {
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
  },
  key: {
    tipo_publicacion: "Tipo",
    estado: "Estado",
    anio: "Año",
    adjudicada: "Adjudicación",
  },
};

const FILTER_OPTIONS: Record<string, FilterOption[]> = {
  tipo_publicacion: [
    { label: "Concurso privado", value: "concurso_privado", key: "tipo_publicacion" },
    { label: "Concurso público", value: "concurso_publico", key: "tipo_publicacion" },
    { label: "Contratación directa", value: "contratacion_directa", key: "tipo_publicacion" },
    { label: "Licitación privada", value: "licitacion_privada", key: "tipo_publicacion" },
    { label: "Licitación pública", value: "licitacion_publica", key: "tipo_publicacion" },
  ],
  estado: [
    { label: "Anteriores", value: "anterior", key: "estado" },
    { label: "Vigentes", value: "vigente", key: "estado" },
  ],
};

// Componente para mostrar filtros activos
const ActiveFilters = ({ 
  filters, 
  onRemoveFilter, 
  onClearAll
}: { 
  filters: Record<string, string>;
  onRemoveFilter: (key: string) => void;
  onClearAll: () => void;
}) => {
  if (Object.keys(filters).length === 0) return null;

  return (
    <>
      <Group mt="md" mb="sm">
        <Text size="sm" fw={500}>Filtros activos:</Text>
        {Object.entries(filters).map(([key, value]) => {
          const displayKey = FILTER_MAPS.key[key] || key;
          const displayValue = FILTER_MAPS[key as keyof Omit<FilterMaps, 'key'>]?.[value] || value;

          return (
            <Badge
              key={key}
              variant="filled"
              color="blue"
              style={{ cursor: "pointer" }}
              onClick={() => onRemoveFilter(key)}
            >
              {displayKey}: {displayValue}
            </Badge>
          );
        })}
        <Text
          size="sm"
          color="blue"
          style={{ cursor: "pointer" }}
          onClick={onClearAll}
        >
          Limpiar todos
        </Text>
      </Group>
      <Divider color="#e0e0e0" my="sm" />
    </>
  );
};

// Función auxiliar para construir URL con filtros
const buildFilterUrl = (currentPath: string, currentFilters: Record<string, string>, filterType: string, value: string): string => {
  const searchParams = new URLSearchParams();
  
  // Copiar filtros existentes
  Object.entries(currentFilters).forEach(([key, val]) => {
    if (key !== filterType) {
      searchParams.set(key, val);
    }
  });

  // Manejar lógica especial para adjudicada
  if (filterType === "adjudicada" && value === "true") {
    searchParams.set(filterType, value);
    return `/adjudicaciones?${searchParams.toString()}`;
  }

  // Agregar o quitar el filtro actual
  if (currentFilters[filterType] === value) {
    searchParams.delete(filterType);
  } else {
    searchParams.set(filterType, value);
  }

  return `${currentPath}?${searchParams.toString()}`;
};

interface FiltrosDesktopProps {
  data: FiltrosData;
  currentFilters: Record<string, string>;
  removeFilter: (filterType: string) => void;
  clearAllFilters: () => void;
  location: { pathname: string };
}

export const FiltrosDesktop = ({ 
  data, 
  currentFilters, 
  removeFilter, 
  clearAllFilters,
  location
}: FiltrosDesktopProps) => {
  const navigate = useNavigate();
  
  // Datos de filtros
  const filtros = data.filtros || {
    tipo_publicacion: {},
    estado: {},
    anio: {},
    adjudicada: { true: 0, false: 0 },
  };

  return (
    <Container size="xl" py="md" fluid>
      <Title order={2}>Filtros</Title>

      <ActiveFilters 
        filters={currentFilters} 
        onRemoveFilter={removeFilter} 
        onClearAll={clearAllFilters} 
      />

      <br />

      {/* Tipo de publicación */}
      <Text size="sm" color="#000" mb="md">Tipo de publicación</Text>
      <Divider color="#e0e0e0" />
      {FILTER_OPTIONS.tipo_publicacion.map((option) => {
        const url = buildFilterUrl(location.pathname, currentFilters, option.key, option.value);
        return (
          <NavLink
            key={option.value}
            component={Link}
            to={url}
            label={option.label}
            rightSection={
              <Badge size="xs" color="red">
                {filtros.tipo_publicacion[option.value] || 0}
              </Badge>
            }
            active={currentFilters[option.key] === option.value}
            styles={{
              root: {
                paddingLeft: 0,
                "&:hover": { backgroundColor: "transparent" },
                cursor: "pointer",
                backgroundColor: currentFilters[option.key] === option.value ? "#e3f2fd" : "transparent",
              },
              body: { fontWeight: 400 },
            }}
            c={currentFilters[option.key] === option.value ? "#1971c2" : "#228be6"}
          />
        );
      })}
      <br />

      {/* Estado */}
      <Text size="sm" color="#000" mb="md">Estado</Text>
      <Divider color="#e0e0e0" my="sm" />
      {FILTER_OPTIONS.estado.map((option) => {
        const url = buildFilterUrl(location.pathname, currentFilters, option.key, option.value);
        return (
          <NavLink
            key={option.value}
            component={Link}
            to={url}
            label={option.label}
            rightSection={
              <Badge size="xs" color="red">
                {filtros.estado[option.value] || 0}
              </Badge>
            }
            active={currentFilters[option.key] === option.value}
            styles={{
              root: {
                paddingLeft: 0,
                "&:hover": { backgroundColor: "transparent" },
                cursor: "pointer",
                backgroundColor: currentFilters[option.key] === option.value ? "#e3f2fd" : "transparent",
              },
              body: { fontWeight: 400 },
            }}
            c={currentFilters[option.key] === option.value ? "#1971c2" : "#228be6"}
          />
        );
      })}
      <br />

      {/* Año */}
      <Text size="sm" color="#000" mb="md">Año</Text>
      <Divider color="#e0e0e0" my="sm" />
      {Object.entries(filtros.anio)
        .sort(([a], [b]) => Number(b) - Number(a))
        .map(([anio, count]) => {
          const url = buildFilterUrl(location.pathname, currentFilters, "anio", anio);
          return (
            <NavLink
              key={anio}
              component={Link}
              to={url}
              label={anio}
              rightSection={
                <Badge size="xs" color="red">
                  {count as number}
                </Badge>
              }
              active={currentFilters.anio === anio}
              styles={{
                root: {
                  paddingLeft: 0,
                  "&:hover": { backgroundColor: "transparent" },
                  cursor: "pointer",
                  backgroundColor: currentFilters.anio === anio ? "#e3f2fd" : "transparent",
                },
                body: { fontWeight: 400 },
              }}
              c={currentFilters.anio === anio ? "#1971c2" : "#228be6"}
            />
          );
        })}
      <br />

      {/* Adjudicaciones */}
      <Text size="sm" color="#000" mb="md">Adjudicaciones</Text>
      <Divider color="#e0e0e0" my="sm" />
      <NavLink
        component={Link}
        to={buildFilterUrl(location.pathname, currentFilters, "adjudicada", "true")}
        label="Adjudicada"
        rightSection={
          <Badge size="xs" color="red">
            {filtros.adjudicada.true || 0}
          </Badge>
        }
        active={currentFilters.adjudicada === "true"}
        styles={{
          root: {
            paddingLeft: 0,
            "&:hover": { backgroundColor: "transparent" },
            cursor: "pointer",
            backgroundColor: currentFilters.adjudicada === "true" ? "#e3f2fd" : "transparent",
          },
          body: { fontWeight: 400 },
        }}
        c={currentFilters.adjudicada === "true" ? "#1971c2" : "#228be6"}
      />
      <br />

      {/* Documentos */}
      <Text size="sm" color="#000" mb="md">Documentos</Text>
      <Divider color="#e0e0e0" my="sm" />
      {data.documentos.map((documento) => (
        <NavLink
          key={documento.id}
          component="div"
          label={documento.nombre}
          rightSection={
            <Group gap="xs">
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/documento/${documento.id}`);
                }}
              >
                <IconEye size={16} />
              </ActionIcon>
              <ActionIcon
                size="sm"
                variant="subtle"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadBase64PDF(documento.contenidoBase64, `${documento.nombre}.pdf`);
                }}
              >
                <IconFileDownload size={16} />
              </ActionIcon>
            </Group>
          }
          onClick={() => navigate(`/documento/${documento.id}`)}
          styles={{
            root: {
              paddingLeft: 0,
              "&:hover": { backgroundColor: "transparent" },
              cursor: "pointer",
            },
            body: { fontWeight: 400 },
          }}
          c="#228be6"
        />
      ))}
    </Container>
  );
};
