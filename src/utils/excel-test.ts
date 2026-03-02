import * as XLSX from 'xlsx';

// Test utility for Excel upload functionality
export class ExcelUploadTester {
  static createTestFile(): File {
    const workbook = XLSX.utils.book_new();
    
    // Create valid test data
    const examsData = [
      {
        code: 'TEST-001',
        title: 'Test Exam',
        durationMins: 60,
        description: 'Test exam for validation',
        isActive: true
      }
    ];
    
    const questionsData = [
      {
        examCode: 'TEST-001',
        text: 'What is 1 + 1?',
        optionA: '1',
        optionB: '2',
        optionC: '3',
        optionD: '4',
        correctOption: 'B',
        order: 1,
        marks: 1
      }
    ];
    
    const examsWorksheet = XLSX.utils.json_to_sheet(examsData);
    const questionsWorksheet = XLSX.utils.json_to_sheet(questionsData);
    
    XLSX.utils.book_append_sheet(workbook, examsWorksheet, 'Exams');
    XLSX.utils.book_append_sheet(workbook, questionsWorksheet, 'Questions');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    return new File([blob], 'test-exam.xlsx', { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }
  
  static createInvalidFile(): File {
    const workbook = XLSX.utils.book_new();
    
    // Create invalid test data (missing required columns)
    const examsData = [
      {
        title: 'Invalid Exam', // Missing 'code'
        description: 'Invalid exam for testing'
        // Missing 'durationMins'
      }
    ];
    
    const questionsData = [
      {
        examCode: 'TEST-001',
        text: 'Invalid question',
        optionA: 'A',
        optionB: 'B',
        // Missing optionC, optionD
        correctOption: 'Z' // Invalid option
      }
    ];
    
    const examsWorksheet = XLSX.utils.json_to_sheet(examsData);
    const questionsWorksheet = XLSX.utils.json_to_sheet(questionsData);
    
    XLSX.utils.book_append_sheet(workbook, examsWorksheet, 'Exams');
    XLSX.utils.book_append_sheet(workbook, questionsWorksheet, 'Questions');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
    
    return new File([blob], 'invalid-exam.xlsx', { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    });
  }
}
