import { Title, Table, Container, rem } from "@mantine/core";
import { Link } from "react-router-dom";
import type { AdjudicacionEspecifica } from "../../interface/Compras";

interface AdjudicacionesDesktopProps {
  data: AdjudicacionEspecifica[];
}

export const AdjudicacionesDesktop = ({ data }: AdjudicacionesDesktopProps) => {
  // Versión desktop - tabla completa
  const desktopRows = data.flatMap((adjudicacion: AdjudicacionEspecifica) => {
    const baseCells = (
      <>
        <Table.Td
          rowSpan={adjudicacion.renglones.length}
          style={{ textAlign: "center", verticalAlign: "middle" }}
        >
          {adjudicacion.expediente}
        </Table.Td>
        <Table.Td
          rowSpan={adjudicacion.renglones.length}
          style={{ textAlign: "center", verticalAlign: "middle" }}
        >
          {adjudicacion.titulo}
        </Table.Td>
        <Table.Td
          rowSpan={adjudicacion.renglones.length}
          style={{ textAlign: "center", verticalAlign: "middle" }}
        >
          <div
            style={{
              overflowY: "auto",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {adjudicacion.descripcion}
          </div>
        </Table.Td>
      </>
    );

    return adjudicacion.renglones.map((renglon, renglonIndex) => (
      <Table.Tr key={`${adjudicacion.expediente}-${renglonIndex}`}>
        {renglonIndex === 0 && baseCells}
        <Table.Td style={{ textAlign: "center", verticalAlign: "middle" }}>
          {renglon.proveedor}
        </Table.Td>
        <Table.Td style={{ textAlign: "center", verticalAlign: "middle" }}>
          {renglon.reglones}
        </Table.Td>
        <Table.Td style={{ textAlign: "center", verticalAlign: "middle" }}>
          ${renglon.monto_total.toLocaleString("es-AR")}
        </Table.Td>
        {renglonIndex === 0 && (
          <Table.Td
            rowSpan={adjudicacion.renglones.length}
            style={{ textAlign: "center", verticalAlign: "middle" }}
          >
            <Link
              to={`/detalle/${adjudicacion.publicacion_id}`}
              style={{ color: "#228be6", textDecoration: "none" }}
            >
              Detalle
            </Link>
          </Table.Td>
        )}
      </Table.Tr>
    ));
  });

  return (
    <Container size="xl" py="md" fluid px="md">
      <Title
        order={2}
        mb="lg"
        style={{
          color: `#228be6`,
          textDecoration: "underline",
        }}
        ta="left"
      >
        Adjudicaciones
      </Title>

      <Table
        striped
        highlightOnHover
        withTableBorder
        withColumnBorders
        styles={{
          table: {
            border: `${rem(1)} solid #228be6`,
          },
          thead: {
            backgroundColor: "#e7f5ff",
          },
          th: {
            color: "#000",
            fontWeight: 600,
            textAlign: "center",
            verticalAlign: "middle",
          },
          tr: {
            "&:hover": {
              backgroundColor: "#f1f3f5",
            },
          },
          td: {
            verticalAlign: "middle",
            textAlign: "center",
          },
        }}
      >
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Exp.</Table.Th>
            <Table.Th>Objeto</Table.Th>
            <Table.Th>Descripción</Table.Th>
            <Table.Th>Proveedor</Table.Th>
            <Table.Th>Renglón</Table.Th>
            <Table.Th>Total</Table.Th>
            <Table.Th>Documentos Relacionados</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{desktopRows}</Table.Tbody>
      </Table>
    </Container>
  );
};
