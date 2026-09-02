import {
  Text,
  NavLink,
  Divider,
  Badge,
  Group,
  Accordion,
  Box,
  Button,
  ScrollArea
} from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import { useMemo } from "react";
import { IconX, IconFileDownload, IconEye } from "@tabler/icons-react";
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
    <Box mb="md">
      <Group position="apart" mb="xs">
        <Text size="sm" fw={500}>Filtros activos:</Text>
        <Button 
          variant="subtle" 
          color="blue" 
          size="xs" 
          onClick={onClearAll}
          compact
        >
          Limpiar todos
        </Button>
      </Group>
      <Group spacing="xs">
        {Object.entries(filters).map(([key, value]) => {
          const displayKey = FILTER_MAPS.key[key] || key;
          const displayValue = FILTER_MAPS[key as keyof Omit<FilterMaps, 'key'>]?.[value] || value;

          return (
            <Badge
              key={key}
              variant="filled"
              color="blue"
              rightSection={
                <IconX 
                  size={12} 
                  style={{ cursor: "pointer" }} 
                  onClick={() => onRemoveFilter(key)} 
                />
              }
              pr={4}
              styles={{ root: { textTransform: 'none' }}}
            >
              {displayKey}: {displayValue}
            </Badge>
          );
        })}
      </Group>
      <Divider my="sm" />
    </Box>
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

interface FiltrosMobileProps {
  data: FiltrosData;
  currentFilters: Record<string, string>;
  removeFilter: (filterType: string) => void;
  clearAllFilters: () => void;
  handleFilterClick: (url: string) => void;
  location: { pathname: string };
}

export const FiltrosMobile = ({ 
  data, 
  currentFilters, 
  removeFilter, 
  clearAllFilters, 
  handleFilterClick,
  location
}: FiltrosMobileProps) => {
  const navigate = useNavigate();
  
  // Datos de filtros
  const filtros = data.filtros || {
    tipo_publicacion: {},
    estado: {},
    anio: {},
    adjudicada: { true: 0, false: 0 },
  };

  return (
    <ScrollArea style={{ height: '100%' }}>
      <Box p="sm">
        <ActiveFilters 
          filters={currentFilters} 
          onRemoveFilter={removeFilter} 
          onClearAll={clearAllFilters}
        />

        <Accordion variant="separated" defaultValue={['tipo', 'estado', 'anio', 'adjudicaciones', 'documentos']} multiple>
          {/* Tipo de publicación */}
          <Accordion.Item value="tipo">
            <Accordion.Control>
              <Text size="sm" fw={500}>Tipo de publicación</Text>
            </Accordion.Control>
            <Accordion.Panel>
              {FILTER_OPTIONS.tipo_publicacion.map((option) => {
                const url = buildFilterUrl(location.pathname, currentFilters, option.key, option.value);
                return (
                  <NavLink
                    key={option.value}
                    component="div"
                    label={option.label}
                    rightSection={
                      <Badge size="xs" color="red">
                        {filtros.tipo_publicacion[option.value] || 0}
                      </Badge>
                    }
                    active={currentFilters[option.key] === option.value}
                    onClick={() => handleFilterClick(url)}
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
            </Accordion.Panel>
          </Accordion.Item>

          {/* Estado */}
          <Accordion.Item value="estado">
            <Accordion.Control>
              <Text size="sm" fw={500}>Estado</Text>
            </Accordion.Control>
            <Accordion.Panel>
              {FILTER_OPTIONS.estado.map((option) => {
                const url = buildFilterUrl(location.pathname, currentFilters, option.key, option.value);
                return (
                  <NavLink
                    key={option.value}
                    component="div"
                    label={option.label}
                    rightSection={
                      <Badge size="xs" color="red">
                        {filtros.estado[option.value] || 0}
                      </Badge>
                    }
                    active={currentFilters[option.key] === option.value}
                    onClick={() => handleFilterClick(url)}
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
            </Accordion.Panel>
          </Accordion.Item>

          {/* Año */}
          <Accordion.Item value="anio">
            <Accordion.Control>
              <Text size="sm" fw={500}>Año</Text>
            </Accordion.Control>
            <Accordion.Panel>
              {Object.entries(filtros.anio)
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([anio, count]) => {
                  const url = buildFilterUrl(location.pathname, currentFilters, "anio", anio);
                  return (
                    <NavLink
                      key={anio}
                      component="div"
                      label={anio}
                      rightSection={
                        <Badge size="xs" color="red">
                          {count as number}
                        </Badge>
                      }
                      active={currentFilters.anio === anio}
                      onClick={() => handleFilterClick(url)}
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
            </Accordion.Panel>
          </Accordion.Item>

          {/* Adjudicaciones */}
          <Accordion.Item value="adjudicaciones">
            <Accordion.Control>
              <Text size="sm" fw={500}>Adjudicaciones</Text>
            </Accordion.Control>
            <Accordion.Panel>
              <NavLink
                component="div"
                label="Adjudicada"
                rightSection={
                  <Badge size="xs" color="red">
                    {filtros.adjudicada.true || 0}
                  </Badge>
                }
                active={currentFilters.adjudicada === "true"}
                onClick={() => handleFilterClick(
                  buildFilterUrl(location.pathname, currentFilters, "adjudicada", "true")
                )}
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
            </Accordion.Panel>
          </Accordion.Item>

          {/* Documentos */}
          <Accordion.Item value="documentos">
            <Accordion.Control>
              <Text size="sm" fw={500}>Documentos</Text>
            </Accordion.Control>
            <Accordion.Panel>
              {data.documentos.map((documento) => (
                <NavLink
                  key={documento.id}
                  component="div"
                  label={documento.nombre}
                  rightSection={
                    <Group gap="xs">
                      <IconEye 
                        size={16} 
                        style={{ cursor: "pointer" }} 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/documento/${documento.id}`);
                        }}
                      />
                      <IconFileDownload 
                        size={16} 
                        style={{ cursor: "pointer" }} 
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadBase64PDF(documento.contenidoBase64, `${documento.nombre}.pdf`);
                        }}
                      />
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
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Box>
    </ScrollArea>
  );
};
