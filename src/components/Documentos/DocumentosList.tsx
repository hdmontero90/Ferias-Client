import { useState } from "react";
import { Box, Text, Group, Accordion, Paper } from "@mantine/core";
import { IconFiles } from "@tabler/icons-react";
import { DocumentoLink } from "./DocumentoLink";
import type { DocumentoLink as DocumentoLinkType } from "../../interface/DocumentoLink";

interface DocumentosListProps {
  documentos: DocumentoLinkType[];
}

export const DocumentosList = ({ documentos }: DocumentosListProps) => {
  const [activeAccordion, setActiveAccordion] = useState<string | null>("documentos");

  if (documentos.length === 0) {
    return (
      <Box p="md" ta="center">
        <Text c="dimmed" size="sm">
          No hay documentos disponibles
        </Text>
      </Box>
    );
  }

  return (
    <Accordion
      variant="separated"
      value={activeAccordion}
      onChange={setActiveAccordion}
      multiple={false}
    >
      <Accordion.Item value="documentos">
        <Accordion.Control>
          <Group>
            <IconFiles size={18} />
            <Text size="sm" fw={500}>
              Documentos ({documentos.length})
            </Text>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Paper p="sm">
            {documentos.map((documento) => (
              <DocumentoLink key={documento.id} documento={documento} />
            ))}
          </Paper>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};