import { Container, Card, Text, Button, Title, Center } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function Pag404() {
  const navigate = useNavigate();

  return (
    <Container 
      fluid 
      style={{ 
        marginTop: '9rem',
        height: 'calc(100vh - 9rem)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Card 
        padding="xl" 
        radius="md" 
        style={{ 
          backgroundColor: '#37bbed',
          border: 'none',
          boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)',
          textAlign: 'center',
          maxWidth: '800px',
          width: '100%'
        }}
      >
        <Card.Section p="xl">
          <Title 
            order={1} 
            style={{ 
              fontWeight: 700,
              fontSize: '260px',
              marginBottom: 0,
              lineHeight: '260px',
              color: 'white',
              '@media (max-width: 768px)': {
                fontSize: '120px',
                lineHeight: '120px'
              }
            }}
          >
            404
          </Title>
          
          <Text 
            size="xl" 
            style={{ 
              fontSize: '18px',
              color: 'white',
              marginTop: 0,
              marginBottom: '2rem'
            }}
          >
            La página que busca no está disponible
          </Text>

          <Center>
            <Button
              onClick={() => navigate("/")}
              variant="filled"
              size="lg"
              style={{ 
                fontSize: '18px',
                backgroundColor: '#228be6',
                '&:hover': {
                  backgroundColor: '#1c7ed6'
                }
              }}
            >
              VOLVER AL SITIO
            </Button>
          </Center>
        </Card.Section>
      </Card>
    </Container>
  );
}

export default Pag404;