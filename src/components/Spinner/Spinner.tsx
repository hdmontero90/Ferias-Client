import { Loader, Center } from "@mantine/core";

export function Spinner() {
  return (
    <Center style={{ 
      height: "100vh", 
      width: "100vw",
      position: "fixed",
      top: 0,
      left: 0
    }}>
      <Loader color="blue" size="xl" type="dots" />
    </Center>
  );
}