import { useState, useEffect } from "react";
import { Modal, Button, Group, Text } from "@mantine/core";
import { IconDownload, IconX } from "@tabler/icons-react";

interface PDFViewerProps {
  opened: boolean;
  onClose: () => void;
  base64Data: string;
  title: string;
}

export const PDFViewer = ({ opened, onClose, base64Data, title }: PDFViewerProps) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);

  useEffect(() => {
    if (base64Data && opened) {
      try {
        // Extraer el tipo MIME y los datos
        const [header, base64Content] = base64Data.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'application/pdf';
        
        // Convertir base64 a blob
        const byteCharacters = atob(base64Content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        
        // Crear URL del blob
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        
        // Limpiar URL cuando se cierre el modal
        return () => URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error al procesar el archivo PDF:', error);
      }
    }
  }, [base64Data, opened]);

  const handleDownload = () => {
    if (base64Data) {
      try {
        // Extraer el tipo MIME y los datos
        const [header, base64Content] = base64Data.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'application/pdf';
        
        // Convertir base64 a blob
        const byteCharacters = atob(base64Content);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });
        
        // Crear enlace de descarga
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${title.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error al descargar el archivo:', error);
      }
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="80%"
      styles={{
        body: {
          height: '70vh',
          padding: 0,
        }
      }}
    >
      {blobUrl ? (
        <iframe
          src={blobUrl}
          style={{ width: '100%', height: '100%', border: 'none' }}
          title={`Vista previa de ${title}`}
        />
      ) : (
        <Text ta="center" py="xl">
          Cargando documento...
        </Text>
      )}
      
      <Group justify="space-between" mt="md">
        <Button
          leftSection={<IconDownload size={16} />}
          onClick={handleDownload}
        >
          Descargar
        </Button>
        <Button
          leftSection={<IconX size={16} />}
          onClick={onClose}
          color="red"
        >
          Cerrar
        </Button>
      </Group>
    </Modal>
  );
};