'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Box,
  Paper,
  Text,
  Group,
  Button,
  Progress,
  Alert,
  Stack,
  List,
  ThemeIcon,
  ActionIcon,
  LoadingOverlay,
  Modal,
} from '@mantine/core';
import * as XLSX from 'xlsx';
import type { ExcelPreview, ExcelUploadResponse, ExcelConflictError } from '../lib/types';
import { uploadExcelFile } from '../services/exam-api';
import { UPLOAD } from '../lib/constants';
import { ExcelValidationError } from '../lib/types';

interface ExcelUploadProps {
  onUploadSuccess?: (response: ExcelUploadResponse) => void;
  onUploadError?: (error: Error) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_TYPES = ['.xlsx'];

export function ExcelUpload({ onUploadSuccess, onUploadError }: ExcelUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ExcelPreview | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<ExcelUploadResponse | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [conflictError, setConflictError] = useState<ExcelConflictError | null>(null);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_TYPES.some(type => file.name.toLowerCase().endsWith(type))) {
      return 'Only .xlsx files are allowed';
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return 'File size exceeds 10MB limit';
    }
    
    return null;
  };

  const parseExcelPreview = async (file: File): Promise<ExcelPreview> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const warnings: string[] = [];
          const sheets: ExcelPreview['sheets'] = [];
          
          // Required columns for each sheet
          const examsRequiredColumns = ['code', 'title', 'durationMins'];
          const questionsRequiredColumns = ['examCode', 'text', 'optionA', 'optionB', 'optionC', 'optionD', 'correctOption'];
          
          // Process each sheet
          workbook.SheetNames.forEach((sheetName) => {
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            
            if (jsonData.length === 0) {
              warnings.push(`Sheet "${sheetName}" is empty`);
              return;
            }
            
            const headers = jsonData[0] as string[];
            const rows = jsonData.slice(1) as any[][];
            
            let hasRequiredColumns = true;
            let missingColumns: string[] = [];
            
            // Check required columns based on sheet name
            if (sheetName.toLowerCase().includes('exam') && !sheetName.toLowerCase().includes('question')) {
              // Exams sheet
              missingColumns = examsRequiredColumns.filter(col => !headers.includes(col));
              hasRequiredColumns = missingColumns.length === 0;
              
              // Validate exam data if columns are present
              if (hasRequiredColumns && rows.length > 0) {
                const codeIndex = headers.indexOf('code');
                const titleIndex = headers.indexOf('title');
                const durationIndex = headers.indexOf('durationMins');
                
                rows.forEach((row, index) => {
                  const rowNum = index + 2; // Excel row numbers start at 2 (1 for header)
                  
                  // Check required fields
                  if (!row[codeIndex]) {
                    warnings.push(`Exams sheet Row ${rowNum}: missing required field 'code'`);
                  }
                  if (!row[titleIndex]) {
                    warnings.push(`Exams sheet Row ${rowNum}: missing required field 'title'`);
                  }
                  if (!row[durationIndex]) {
                    warnings.push(`Exams sheet Row ${rowNum}: missing required field 'durationMins'`);
                  } else if (isNaN(Number(row[durationIndex])) || Number(row[durationIndex]) <= 0) {
                    warnings.push(`Exams sheet Row ${rowNum}: durationMins must be a positive integer`);
                  }
                });
                
                // Check for duplicate exam codes
                const codes = rows
                  .filter(row => row[codeIndex])
                  .map(row => String(row[codeIndex]).trim());
                const duplicateCodes = codes.filter((code, index) => codes.indexOf(code) !== index);
                if (duplicateCodes.length > 0) {
                  warnings.push(`Exams sheet: duplicate exam codes found: ${[...new Set(duplicateCodes)].join(', ')}`);
                }
              }
            } else if (sheetName.toLowerCase().includes('question')) {
              // Questions sheet
              missingColumns = questionsRequiredColumns.filter(col => !headers.includes(col));
              hasRequiredColumns = missingColumns.length === 0;
              
              // Validate question data if columns are present
              if (hasRequiredColumns && rows.length > 0) {
                const examCodeIndex = headers.indexOf('examCode');
                const textIndex = headers.indexOf('text');
                const correctOptionIndex = headers.indexOf('correctOption');
                
                rows.forEach((row, index) => {
                  const rowNum = index + 2; // Excel row numbers start at 2
                  
                  // Check required fields
                  if (!row[examCodeIndex]) {
                    warnings.push(`Questions sheet Row ${rowNum}: missing required field 'examCode'`);
                  }
                  if (!row[textIndex]) {
                    warnings.push(`Questions sheet Row ${rowNum}: missing required field 'text'`);
                  }
                  if (!row[correctOptionIndex]) {
                    warnings.push(`Questions sheet Row ${rowNum}: missing required field 'correctOption'`);
                  } else if (!['A', 'B', 'C', 'D'].includes(String(row[correctOptionIndex]).toUpperCase())) {
                    warnings.push(`Questions sheet Row ${rowNum}: correctOption must be A, B, C, or D`);
                  }
                });
              }
            } else {
              // Unknown sheet - assume it's valid for now
              hasRequiredColumns = true;
            }
            
            sheets.push({
              name: sheetName,
              rowCount: rows.length,
              headers: headers,
              hasRequiredColumns,
              missingColumns: missingColumns.length > 0 ? missingColumns : undefined,
            });
          });
          
          // Check if we have required sheets
          const hasExamsSheet = workbook.SheetNames.some(name => 
            name.toLowerCase().includes('exam') && !name.toLowerCase().includes('question')
          );
          const hasQuestionsSheet = workbook.SheetNames.some(name => 
            name.toLowerCase().includes('question')
          );
          
          if (!hasExamsSheet) {
            warnings.push('Missing "Exams" sheet (or sheet with "exam" in name)');
          }
          if (!hasQuestionsSheet) {
            warnings.push('Missing "Questions" sheet (or sheet with "question" in name)');
          }
          
          // Cross-validate exam codes between sheets
          if (hasExamsSheet && hasQuestionsSheet) {
            const examsSheet = workbook.SheetNames.find(name => 
              name.toLowerCase().includes('exam') && !name.toLowerCase().includes('question')
            );
            const questionsSheet = workbook.SheetNames.find(name => 
              name.toLowerCase().includes('question')
            );
            
            if (examsSheet && questionsSheet) {
              const examsData = XLSX.utils.sheet_to_json(workbook.Sheets[examsSheet]) as any[];
              const questionsData = XLSX.utils.sheet_to_json(workbook.Sheets[questionsSheet]) as any[];
              
              const examCodes = examsData
                .map(row => row.code)
                .filter(code => code)
                .map(code => String(code).trim());
              
              const questionExamCodes = questionsData
                .map(row => row.examCode)
                .filter(code => code)
                .map(code => String(code).trim());
              
              const orphanedCodes = [...new Set(questionExamCodes)].filter(code => !examCodes.includes(code));
              if (orphanedCodes.length > 0) {
                warnings.push(`Questions reference exam codes not found in Exams sheet: ${orphanedCodes.join(', ')}`);
              }
            }
          }
          
          const isValid = warnings.length === 0 && sheets.length >= 2;
          
          resolve({
            fileName: file.name,
            fileSize: file.size,
            sheets,
            isValid,
            warnings,
          });
          
        } catch (error) {
          reject(new Error('Failed to parse Excel file'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileSelect = useCallback(async (file: File) => {
    setError(null);
    setSuccess(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setSelectedFile(file);
    
    try {
      const filePreview = await parseExcelPreview(file);
      setPreview(filePreview);
    } catch (err) {
      setError('Failed to parse Excel file');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setConflictError(null);
    
    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
      
      const response = await uploadExcelFile(selectedFile, 'error');
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setSuccess(response);
      setShowSuccessModal(true);
      onUploadSuccess?.(response);
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      
      // Check if this is a conflict error
      if (err instanceof ExcelValidationError && err.errors.some((e: string) => e === 'DATABASE_CONFLICTS' || e === 'ALL_DUPLICATES')) {
        // Try to extract conflict information from the error
        const conflictType = err.errors.find((e: string) => e === 'DATABASE_CONFLICTS' || e === 'ALL_DUPLICATES');
        const conflictCodes = err.errors.filter((e: string) => e !== 'DATABASE_CONFLICTS' && e !== 'ALL_DUPLICATES');
        
        setConflictError({
          message: errorMessage,
          type: conflictType as 'DATABASE_CONFLICTS' | 'ALL_DUPLICATES',
          conflicts: conflictCodes.map((code: string) => ({ code, title: `Exam ${code}` })),
          suggestion: conflictType === 'DATABASE_CONFLICTS' 
            ? 'Skip duplicate exams or use different exam codes'
            : 'All exams already exist. Use different exam codes.'
        });
        setShowConflictModal(true);
      } else {
        setError(errorMessage);
        setShowErrorModal(true);
        onUploadError?.(err instanceof Error ? err : new Error(errorMessage));
      }
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setSuccess(null);
    setConflictError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRetryWithSkipStrategy = () => {
    console.log('handleRetryWithSkipStrategy called');
    setShowConflictModal(false);
    setConflictError(null);
    // Retry upload with skip strategy
    setTimeout(async () => {
      console.log('Starting retry upload with skip strategy');
      try {
        setIsUploading(true);
        setUploadProgress(0);
        const response = await uploadExcelFile(selectedFile!, 'skip');
        console.log('Skip upload successful:', response);
        setUploadProgress(100);
        setSuccess(response);
        setShowSuccessModal(true);
        onUploadSuccess?.(response);
      } catch (err) {
        console.log('Skip upload error:', err);
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        setShowErrorModal(true);
        onUploadError?.(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setIsUploading(false);
      }
    }, 300);
  };

  const handleCancelConflict = () => {
    setShowConflictModal(false);
    setConflictError(null);
    setIsUploading(false);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    clearSelection();
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Stack gap="md">
      {/* Upload Area */}
      <Paper
        withBorder
        p="xl"
        style={{
          borderStyle: isDragOver ? 'dashed' : 'solid',
          borderColor: isDragOver ? 'var(--mantine-color-blue-6)' : undefined,
          backgroundColor: isDragOver ? 'var(--mantine-color-blue-0)' : undefined,
          position: 'relative',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <LoadingOverlay visible={isUploading} />
        
        <Stack align="center" gap="md">
          <ThemeIcon size={60} radius="xl" color="blue">
            <Text size="xl">📁</Text>
          </ThemeIcon>
          
          <Stack align="center" gap={0}>
            <Text size="lg" fw={500}>
              {UPLOAD.DRAG_DROP}
            </Text>
            <Text size="sm" c="dimmed">
              {UPLOAD.OR_CLICK}
            </Text>
          </Stack>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
          
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            {UPLOAD.CHOOSE_FILE}
          </Button>
          
          <Text size="xs" c="dimmed">
            {UPLOAD.ACCEPTED_FORMAT}
          </Text>
        </Stack>
      </Paper>

      {/* File Selection Info */}
      {selectedFile && (
        <Paper withBorder p="md">
          <Group justify="space-between">
            <Group>
              <ThemeIcon color="blue" variant="light">
                <Text size="md">📄</Text>
              </ThemeIcon>
              <div>
                <Text size="sm" fw={500}>{selectedFile.name}</Text>
                <Text size="xs" c="dimmed">{formatFileSize(selectedFile.size)}</Text>
              </div>
            </Group>
            
            <ActionIcon
              color="red"
              variant="subtle"
              onClick={clearSelection}
              disabled={isUploading}
            >
              <Text size="md">✕</Text>
            </ActionIcon>
          </Group>
        </Paper>
      )}

      {/* File Preview */}
      {preview && (
        <Paper withBorder p="md" bg="var(--mantine-color-gray-light)">
          <Stack gap="sm">
            <Text size="sm" fw={500} c="blue">File Preview</Text>
            
            <List size="sm">
              {preview.sheets.map((sheet, index) => (
                <List.Item key={index}>
                  <Group gap="sm">
                    <ThemeIcon 
                      size="sm" 
                      color={sheet.hasRequiredColumns ? 'green' : 'orange'}
                      variant="light"
                    >
                      <Text size="xs">
                        {sheet.hasRequiredColumns ? '✓' : '⚠'}
                      </Text>
                    </ThemeIcon>
                    <Text c="dimmed">
                      <strong>{sheet.name}</strong> - {sheet.rowCount} rows
                    </Text>
                  </Group>
                  {sheet.missingColumns && sheet.missingColumns.length > 0 && (
                    <Text size="xs" c="orange" ml="xl">
                      Missing: {sheet.missingColumns.join(', ')}
                    </Text>
                  )}
                </List.Item>
              ))}
            </List>
            
            {preview.warnings.length > 0 && (
              <Stack gap="xs">
                <Text size="sm" fw={500} c="orange">Warnings:</Text>
                <List size="sm" spacing="xs">
                  {preview.warnings.map((warning, index) => (
                    <List.Item key={index}>
                      <Text size="xs" c="dimmed">{warning}</Text>
                    </List.Item>
                  ))}
                </List>
              </Stack>
            )}
            
            <Group gap="sm">
              <ThemeIcon 
                size="sm" 
                color={preview.isValid ? 'green' : 'red'}
                variant="light"
              >
                <Text size="xs">
                  {preview.isValid ? '✓' : '✗'}
                </Text>
              </ThemeIcon>
              <Text size="sm" c={preview.isValid ? 'green' : 'red'} fw={500}>
                {preview.isValid ? 'File is valid' : 'File has issues'}
              </Text>
            </Group>
          </Stack>
        </Paper>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Paper withBorder p="md" bg="var(--mantine-color-blue-light)">
          <Stack gap="sm">
            <Group justify="space-between">
              <Text size="sm" fw={500} c="blue">Uploading...</Text>
              <Text size="xs" c="dimmed">{uploadProgress}%</Text>
            </Group>
            <Progress value={uploadProgress} color="blue" />
            <Text size="xs" c="dimmed">Please wait while we process your Excel file...</Text>
          </Stack>
        </Paper>
      )}

      {/* Upload Button */}
      {selectedFile && !isUploading && !success && (
        <Button
          onClick={handleUpload}
          fullWidth
          size="lg"
          color="blue"
          disabled={!preview?.isValid}
        >
          Upload Excel File
        </Button>
      )}

      {/* Conflict Resolution Modal */}
      <Modal
        opened={showConflictModal}
        onClose={handleCancelConflict}
        title="Duplicate Exam Codes Found"
        size="md"
        centered
      >
        <Stack gap="md">
          <Text c="dimmed">{conflictError?.message}</Text>
          
          {conflictError?.conflicts && conflictError.conflicts.length > 0 && (
            <Stack gap="sm">
              <Text size="sm" fw={500} c="yellow">Conflicting exam codes:</Text>
              <List size="sm" spacing="xs">
                {conflictError.conflicts.map((conflict, index) => (
                  <List.Item key={index}>
                    <Text c="dimmed">
                      <strong>{conflict.code}</strong> - {conflict.title}
                    </Text>
                  </List.Item>
                ))}
              </List>
            </Stack>
          )}
          
          <Text size="sm" c="dimmed">{conflictError?.suggestion}</Text>
          
          <Group gap="sm" justify="flex-end">
            <Button
              variant="filled"
              color="blue"
              onClick={handleRetryWithSkipStrategy}
            >
              Skip Duplicates & Continue
            </Button>
            <Button
              variant="outline"
              onClick={handleCancelConflict}
            >
              Cancel
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Success Modal */}
      <Modal
        opened={showSuccessModal}
        onClose={handleCloseSuccessModal}
        title="✅ Upload Completed Successfully"
        size="md"
        centered
      >
        <Stack gap="md">
          <Text size="lg" fw={500}>Your Excel file has been processed!</Text>
          
          <Stack gap="xs">
            <Group gap="sm">
              <ThemeIcon color="green" size="sm" variant="light">
                <Text size="sm">✓</Text>
              </ThemeIcon>
              <Text size="sm">
                <strong>{success?.examsCreated}</strong> new exams created
              </Text>
            </Group>
            
            {(success?.examsSkipped ?? 0) > 0 && (
              <Group gap="sm">
                <ThemeIcon color="yellow" size="sm" variant="light">
                  <Text size="sm">⚠</Text>
                </ThemeIcon>
                <Text size="sm" c="yellow">
                  <strong>{success?.examsSkipped}</strong> exams skipped (duplicates)
                </Text>
              </Group>
            )}
          </Stack>

          {success?.details && success.details.length > 0 && (
            <Stack gap="sm">
              <Text size="sm" fw={500}>Uploaded Exams:</Text>
              <Paper withBorder p="sm" bg="var(--mantine-color-gray-light)">
                <List size="sm" spacing="xs" withPadding={false}>
                  {success.details.map((detail, index) => (
                    <List.Item key={index}>
                      <Group gap="sm">
                        <ThemeIcon color="blue" size="xs" variant="light">
                          <Text size="xs">📋</Text>
                        </ThemeIcon>
                        <Text size="sm">
                          <strong>{detail.code}</strong> - {detail.questionCount} questions
                        </Text>
                      </Group>
                    </List.Item>
                  ))}
                </List>
              </Paper>
            </Stack>
          )}
          
          {success?.conflicts && success.conflicts.length > 0 && (
            <Stack gap="sm">
              <Text size="sm" fw={500} c="yellow">Skipped Exams (Already Exist):</Text>
              <Paper withBorder p="sm" bg="var(--mantine-color-yellow-light)">
                <List size="sm" spacing="xs" withPadding={false}>
                  {success.conflicts.map((conflict, index) => (
                    <List.Item key={index}>
                      <Group gap="sm">
                        <ThemeIcon color="orange" size="xs" variant="light">
                          <Text size="xs">⚠</Text>
                        </ThemeIcon>
                        <Text size="sm" c="dimmed">
                          <strong>{conflict.code}</strong> - {conflict.title}
                        </Text>
                      </Group>
                    </List.Item>
                  ))}
                </List>
              </Paper>
            </Stack>
          )}
          
          <Group gap="sm" justify="flex-end">
            <Button
              variant="filled"
              color="blue"
              onClick={handleCloseSuccessModal}
            >
              Upload Another File
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Error Modal */}
      <Modal
        opened={showErrorModal}
        onClose={handleCloseErrorModal}
        title="Upload Error"
        size="md"
        centered
      >
        <Stack gap="md">
          <Text c="red">{error}</Text>
          <Group gap="sm" justify="flex-end">
            <Button
              variant="outline"
              onClick={handleCloseErrorModal}
            >
              Close
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}
