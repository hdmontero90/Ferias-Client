import { useState } from "react";
import { Box, Text, Group, ActionIcon, Badge } from "@mantine/core";
import { IconEye, IconDownload } from "@tabler/icons-react";
import type { DocumentoLink as DocumentoLinkType } from "../../interface/DocumentoLink";
import { openBase64PDF, downloadBase64PDF } from "../../utils/base64PDF";

interface DocumentoLinkProps {
  documento: DocumentoLinkType;
}

export const DocumentoLink = ({ documento }: DocumentoLinkProps) => {
  const [loading, setLoading] = useState(false);

  const handleView = () => {
    setLoading(true);
    try {
      openBase64PDF(documento.contenidoBase64);
    } catch (error) {
      console.error("Error al abrir el documento:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    setLoading(true);
    try {
      downloadBase64PDF(documento.contenidoBase64, `${documento.nombre}.pdf`);
    } catch (error) {
      console.error("Error al descargar el documento:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el tamaño del archivo desde base64
  const getFileSize = (base64String: string): string => {
    try {
      const base64Data = base64String.split(',')[1];
      const byteLength = (base64Data.length * 3) / 4;
      const kb = byteLength / 1024;
      
      if (kb < 1024) {
        return `${kb.toFixed(1)} KB`;
      } else {
        return `${(kb / 1024).toFixed(1)} MB`;
      }
    } catch {
      return "Tamaño desconocido";
    }
  };

  return (
    <Box 
      p="sm" 
      mb="xs" 
      style={{ 
        border: `1px solid #e0e0e0`,
        borderRadius: 4,
        backgroundColor: "#fff",
      }}
    >
      <Group justify="space-between" mb="xs">
        <Text fw={500} size="sm">
          {documento.nombre}
        </Text>
        
        <Group gap="xs">
          <ActionIcon
            variant="subtle"
            color="blue"
            size="sm"
            onClick={handleView}
            disabled={loading}
          >
            <IconEye size={16} />
          </ActionIcon>
          <ActionIcon
            variant="subtle"
            color="blue"
            size="sm"
            onClick={handleDownload}
            disabled={loading}
          >
            <IconDownload size={16} />
          </ActionIcon>
        </Group>
      </Group>
      
      <Group>
        <Badge color="blue" variant="light" size="xs">
          {getFileSize(documento.contenidoBase64)}
        </Badge>
        <Badge color="green" variant="light" size="xs">
          PDF
        </Badge>
      </Group>
    </Box>
  );
};