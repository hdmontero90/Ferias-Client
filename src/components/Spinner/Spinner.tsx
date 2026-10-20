import { Center, Loader } from "@mantine/core";

/** Spinner a pantalla completa mientras carga contenido. */
export function Spinner() {
  return (
    <Center
      style={{
        height: "60vh",
        width: "100%",
      }}
    >
      <Loader color="blue" size="xl" type="dots" />
    </Center>
  );
}
