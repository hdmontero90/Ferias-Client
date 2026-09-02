import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, Title, Text, Box, Alert, Button } from "@mantine/core";
import { IconAlertCircle, IconDownload } from "@tabler/icons-react";
import { useGetQuery } from "../Api/apiRTK";
import { Spinner } from "../components/Spinner/Spinner";
import type { DocumentoLink } from "../interface/DocumentoLink";
import { base64ToBlob } from "../utils/base64PDF";

const DocumentoDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [documento, setDocumento] = useState<DocumentoLink | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data,
    isLoading,
    error: queryError,
  } = useGetQuery(`/api/documentos/${id}`) as {
    data?: DocumentoLink;
    isLoading: boolean;
    error?: { status: number; data: unknown } | null;
  };

  useEffect(() => {
    if (data) {
      setDocumento(data);

      // Convert base64 to blob URL for iframe
      try {
        const blob = base64ToBlob(data.contenidoBase64);
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);

        // Clean up URL when component unmounts
        return () => URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error processing PDF:", err);
        setError("Error al procesar el documento");
      }
    } else if (queryError) {
      setError("Documento no encontrado");
    }
  }, [data, queryError]);

  const handleDownload = () => {
    if (documento?.contenidoBase64) {
      try {
        const blob = base64ToBlob(documento.contenidoBase64);
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${documento.nombre}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
      } catch (err) {
        console.error("Error downloading PDF:", err);
      }
    }
  };

  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Esto vuelve a la página anterior en el historial
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error || queryError) {
    return (
      <Container size="xl" py="md">
        <Alert icon={<IconAlertCircle size={16} />} title="Error" color="red">
          {error || "Error al cargar el documento"}
        </Alert>
      </Container>
    );
  }

  if (!documento) {
    return (
      <Container size="xl" py="md">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="No encontrado"
          color="yellow"
        >
          Documento no encontrado
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" py="md">
      <Box mb="xl">
        <Title order={2} mb="md">
          {documento.nombre}
        </Title>
        <Text size="sm" c="dimmed" mb="md">
          Documento disponible para visualización y descarga
        </Text>
        <Button
          leftSection={<IconDownload size={16} />}
          onClick={handleDownload}
        >
          Descargar documento
        </Button>
      </Box>

      {blobUrl ? (
        <iframe
          src={blobUrl}
          style={{
            width: "100%",
            height: "70vh",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
          }}
          title={`Vista previa de ${documento.nombre}`}
        />
      ) : (
        <Text ta="center" py="xl">
          Cargando documento...
        </Text>
      )}

      <Button
        variant="filled"
        onClick={handleGoBack}
        fullWidth={false}
        size="lg"
      >
        Volver al listado
      </Button>
    </Container>
  );
};

export default DocumentoDetalle;
