import * as XLSX from 'xlsx';

export const readExcelFile = async (file: File): Promise<{ sheetNames: string[]; defaultSemestre: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Try to find a sheet name that matches the semester pattern (e.g., "S4 CI")
        const defaultSemestre = workbook.SheetNames.find(name => /S[1-8]\s*[A-Z]{2,}/i.test(name)) || '';
        
        resolve({
          sheetNames: workbook.SheetNames,
          defaultSemestre
        });
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

export interface ProcessedData {
  [key: string]: any;
}

export const extractSheetData = async (
  file: File, 
  sheetName: string
): Promise<ProcessedData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        if (!workbook.SheetNames.includes(sheetName)) {
          throw new Error(`Sheet "${sheetName}" not found in the Excel file.`);
        }
        
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });
        
        // Process the data similar to the original script
        const processedData: ProcessedData[] = [];
        let currentData: { [key: string]: string } = {};
        
        jsonData.forEach((row: any, index: number) => {
          // Initialize with first row
          if (index === 0) {
            for (const key in row) {
              if (row[key] !== undefined) {
                currentData[key] = row[key];
              }
            }
          } else {
            // Update fields if they have new values
            for (const key in row) {
              if (row[key] !== undefined) {
                currentData[key] = row[key];
              }
            }
          }
          
          // Create a new entry with all current data
          const entry = { ...currentData };
          
          // Format the date if it exists
          if (entry.Dates) {
            const dateParts = entry.Dates.split('/');
            if (dateParts.length === 3) {
              entry.Dates = `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;
            }
          }
          
          // Format the time if it exists
          if (entry.Heure) {
            entry.Heure = entry.Heure.split('-')[0];
          }
          
          processedData.push(entry);
        });
        
        resolve(processedData);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};