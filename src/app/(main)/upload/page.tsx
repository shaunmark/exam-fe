'use client';

import {
  Container,
  Title,
  Text,
  Stack,
  Paper,
  Alert,
  Button,
  Group,
  List,
  ThemeIcon,
} from '@mantine/core';
import Link from 'next/link';
import * as XLSX from 'xlsx';
import { ExcelUpload } from '@/components/ExcelUpload';
import type { ExcelUploadResponse } from '@/lib/types';
import { UPLOAD } from '@/lib/constants';

export default function UploadPage() {
  const handleUploadSuccess = (response: ExcelUploadResponse) => {
    console.log('Upload successful:', response);
  };

  const handleUploadError = (error: Error) => {
    console.error('Upload error:', error);
  };

  const downloadTemplate = () => {
    // Create Excel template with proper structure
    const workbook = XLSX.utils.book_new();
    
    // Exams sheet
    const examsWorksheet = XLSX.utils.json_to_sheet([...UPLOAD.SAMPLE_EXAMS]);
    XLSX.utils.book_append_sheet(workbook, examsWorksheet, 'Exams');
    
    // Questions sheet
    const questionsWorksheet = XLSX.utils.json_to_sheet([...UPLOAD.SAMPLE_QUESTIONS]);
    XLSX.utils.book_append_sheet(workbook, questionsWorksheet, 'Questions');
    
    // Generate and download the file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = UPLOAD.TEMPLATE_FILENAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <Stack align="center" gap="xs">
          <Title order={1}>{UPLOAD.TITLE}</Title>
          <Text c="dimmed" ta="center" size="lg">
            {UPLOAD.SUBTITLE}
          </Text>
        </Stack>

        {/* Instructions */}
        <Paper withBorder p="lg" bg="var(--mantine-color-blue-light)">
          <Stack gap="md">
            <Text size="lg" fw={500} c="blue">{UPLOAD.INSTRUCTIONS_TITLE}</Text>
            
            <Stack gap="sm">
              <Text size="sm" fw={500} c="blue">{UPLOAD.FILE_REQUIREMENTS_TITLE}</Text>
              <List size="sm" spacing="xs">
                {UPLOAD.FILE_REQUIREMENTS.map((requirement, index) => (
                  <List.Item key={index}>
                    <Text c="dimmed">{requirement}</Text>
                  </List.Item>
                ))}
              </List>
            </Stack>

            <Stack gap="sm">
              <Text size="sm" fw={500} c="blue">{UPLOAD.EXAMS_SHEET_TITLE}</Text>
              <List size="sm" spacing="xs">
                {UPLOAD.EXAMS_SHEET_COLUMNS.map((column, index) => (
                  <List.Item key={index}>
                    <Text c="dimmed">
                      <strong>{column.name}</strong> ({column.required ? 'required' : 'optional'}): {column.description}
                    </Text>
                  </List.Item>
                ))}
              </List>
            </Stack>

            <Stack gap="sm">
              <Text size="sm" fw={500} c="blue">{UPLOAD.QUESTIONS_SHEET_TITLE}</Text>
              <List size="sm" spacing="xs">
                {UPLOAD.QUESTIONS_SHEET_COLUMNS.map((column, index) => (
                  <List.Item key={index}>
                    <Text c="dimmed">
                      <strong>{column.name}</strong> ({column.required ? 'required' : 'optional'}): {column.description}
                    </Text>
                  </List.Item>
                ))}
              </List>
            </Stack>

            <Group>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTemplate}
                leftSection={<Text>↓</Text>}
              >
                {UPLOAD.DOWNLOAD_TEMPLATE}
              </Button>
              <Text size="xs" c="dimmed">
                {UPLOAD.DOWNLOAD_SUBTITLE}
              </Text>
            </Group>
          </Stack>
        </Paper>

        {/* Upload Component */}
        <ExcelUpload
          onUploadSuccess={handleUploadSuccess}
          onUploadError={handleUploadError}
        />

        {/* Navigation */}
        <Group justify="center">
          <Button
            component={Link}
            href="/exam"
            variant="subtle"
            size="sm"
          >
            {UPLOAD.BACK_TO_EXAMS}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
