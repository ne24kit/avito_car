import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Image,
  Button,
  Box,
  Grid,
  Paper,
  Text,
  List,
  Tabs,
  Flex,
  Badge,
} from "@mantine/core";
import avitoIcon1 from "../assets/avito.png";

function ResultPage() {
  const location = useLocation();
  const responseData = location.state?.data || {};
  const navigate = useNavigate();

  const { common_analysis = {}, images = [] } = responseData;

  if (!common_analysis || images.length === 0) {
    return (
      <Container size="lg" py="xl">
        <Text>Data unavailable</Text>
        <Button onClick={() => navigate("/")} mt="md">
          Return to main page
        </Button>
      </Container>
    );
  }

  // Format analysis data for display
  const damageList = Object.entries(common_analysis).map(([desc, prob]) => ({
    description: desc,
    probability: (prob * 100).toFixed(2), // Convert to percentage
  }));

  return (
    <Container size="lg" py="xl">
      <Flex
        justify="center"
        align="center"
        gap="xl"
        mt="xl"
        mb="xl"
        style={{ position: "relative" }}
      >
        <Image
          src={avitoIcon1 || "/placeholder.svg"}
          alt="Avito Logo"
          width={150}
          height={80}
          fit="contain"
        />
        <Button
          onClick={() => navigate("/")}
          size="lg"
          style={{
            position: "absolute",
            right: 0,
            fontSize: "16px",
            padding: "12px 24px",
          }}
        >
          Back
        </Button>
      </Flex>

      {/* Tabs with photos */}
      <Tabs defaultValue={`photo-0`}>
        <Tabs.List>
          {images.map((_, index) => (
            <Tabs.Tab key={index} value={`photo-${index}`}>
              Photo {index + 1}
            </Tabs.Tab>
          ))}
        </Tabs.List>

        {images.map((result, index) => {
          const imageUrl = result.processed_image.startsWith("/")
            ? `http://localhost:8082${result.processed_image}`
            : result.processed_image;

          return (
            <Tabs.Panel key={index} value={`photo-${index}`} pt="xl">
              <Grid gutter="xl" align="stretch">
                {/* Left column - photo */}
                <Grid.Col span={6}>
                  <Paper
                    withBorder
                    radius="md"
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "20px",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={`Car photo ${index + 1}`}
                      radius="md"
                      style={{
                        maxWidth: "100%",
                        maxHeight: "500px",
                        objectFit: "contain",
                      }}
                    />
                  </Paper>
                </Grid.Col>

                {/* Right column - damage analysis */}
                <Grid.Col span={6}>
                  <Paper
                    shadow="sm"
                    p="xl"
                    radius="md"
                    withBorder
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: "#f8f9fa",
                    }}
                  >
                    <Box style={{ flex: 1 }}>
                      <Title order={3} mb="md" align="center">
                        Damage Analysis
                      </Title>
                      <Box mb="xl">
                        <Text size="lg" weight={500} mb="sm">
                          Detected damages:
                        </Text>
                        {damageList.length > 0 ? (
                          <List spacing="sm" size="sm" mb="md">
                            {damageList.map((damage, idx) => (
                              <List.Item key={idx}>
                                {damage.description}:{" "}
                                <Badge color="blue">{damage.probability}%</Badge>
                              </List.Item>
                            ))}
                          </List>
                        ) : (
                          <Text size="sm" color="dimmed">
                            No damages detected
                          </Text>
                        )}
                      </Box>
                    </Box>
                  </Paper>
                </Grid.Col>
              </Grid>
            </Tabs.Panel>
          );
        })}
      </Tabs>
    </Container>
  );
}

export default ResultPage;