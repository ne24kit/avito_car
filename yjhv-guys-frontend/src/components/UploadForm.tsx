import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Title, Paper, FileInput, Button, Group, LoadingOverlay, Avatar, Box, Image, Text, Card, ActionIcon, SimpleGrid, Stack, Badge, Flex } from '@mantine/core';
import { IconUpload, IconX, IconPhoto } from '@tabler/icons-react';
import avitoIcon2 from '../assets/avito2.png';
import avitoIcon1 from '../assets/avito.png';

function UploadForm() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (newFiles) => {
    if (newFiles && newFiles.length > 0) {
      // Add new files to existing ones, avoiding duplicates
      const existingFileNames = files.map(f => f.name);
      const uniqueNewFiles = newFiles.filter(file => 
        !existingFileNames.includes(file.name)
      );
      
      setFiles(prevFiles => [...prevFiles, ...uniqueNewFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setFiles([]);
  };

  // Create URL for image preview
  const createImagePreview = (file) => {
    return URL.createObjectURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;
    
    setLoading(true);
    const formData = new FormData();
    
    // Add all files
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:8082/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setLoading(false);
      navigate('/result', { state: { data: response.data } });
    } catch (error) {
      console.error('Error uploading file:', error);
      setLoading(false);
    }
  };

  return (
    <Container size="md" py="xl">
      <Box mb="xl" sx={{ display: 'flex', justifyContent: 'center' }}>
        <Image 
          src={avitoIcon1 || "/placeholder.svg"} 
          alt="Avito Logo" 
          width={200}
          height={100}
          fit="contain"
        />
      </Box>

      <Paper withBorder shadow="md" p={30} radius="md" pos="relative">
        <LoadingOverlay visible={loading} />
        
        <Group position="center" mb="xl">
          <Avatar src={avitoIcon2} alt="Avito Logo" size={64} radius="xl" />
          <Title order={1} align="center">Upload car photos</Title>
        </Group>
        
        <form onSubmit={handleSubmit}>
          <Stack spacing="md">
            <FileInput
              label="Add images"
              placeholder="Click to select files"
              icon={<IconUpload size={14} />}
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
            
            {files.length > 0 && (
              <Box>
                <Group position="apart" mb="sm">
                  <Flex align="center" gap="xs">
                    <Text size="sm" weight={500}>
                      Selected files:
                    </Text>
                    <Badge variant="filled">{files.length}</Badge>
                  </Flex>
                  <Button 
                    variant="subtle" 
                    size="xs" 
                    color="red"
                    onClick={clearAllFiles}
                  >
                    Clear all
                  </Button>
                </Group>
                
                <SimpleGrid 
                  cols={2} 
                  spacing="sm"
                  breakpoints={[
                    { maxWidth: 'sm', cols: 1 }
                  ]}
                >
                  {files.map((file, index) => (
                    <Card key={index} withBorder padding="sm" radius="md">
                      <Card.Section>
                        <Box sx={{ position: 'relative' }}>
                          {file.type.startsWith('image/') ? (
                            <Image
                              src={createImagePreview(file) || "/placeholder.svg"}
                              alt={file.name}
                              height={120}
                              fit="cover"
                            />
                          ) : (
                            <Box 
                              sx={{ 
                                height: 120, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                backgroundColor: '#f8f9fa'
                              }}
                            >
                              <IconPhoto size={40} color="#adb5bd" />
                            </Box>
                          )}
                          <ActionIcon
                            color="red"
                            variant="filled"
                            size="sm"
                            sx={{
                              position: 'absolute',
                              top: 5,
                              right: 5,
                            }}
                            onClick={() => removeFile(index)}
                          >
                            <IconX size={12} />
                          </ActionIcon>
                        </Box>
                      </Card.Section>
                      
                      <Text size="xs" mt="xs" lineClamp={1} title={file.name}>
                        {file.name}
                      </Text>
                      <Text size="xs" color="dimmed">
                        {Math.round(file.size / 1024)} KB
                      </Text>
                    </Card>
                  ))}
                </SimpleGrid>
              </Box>
            )}
            
            <Button 
              fullWidth 
              type="submit" 
              disabled={loading || files.length === 0}
              loading={loading}
              size="lg"
            >
              {loading ? 'Analyzing...' : 
               files.length === 0 ? 'Select photos for analysis' :
               `Analyze ${files.length} photos`}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}

export default UploadForm;