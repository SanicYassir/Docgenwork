import { saveAs } from 'file-saver';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import DocxMerger from 'docx-merger';
import { extractSheetData, ProcessedData } from './excelUtils';
import { FormSettings, GeneratedDocument } from '../contexts/FilesContext';
import { saveGenerationLog } from './logUtils';

interface ProcessingParams {
  excelFile: File;
  pvTemplate: File;
  chemiseTemplate: File;
  enveloppeTemplate: File;
  settings: FormSettings;
  onProgress: (progress: number) => void;
}

interface DocData {
  session: string;
  Semestre: string;
  Year: string;
  controlType: string;
  Dates: string;
  Locaux: string;
  Heure: string;
  Module: string;
  Coordinateur: string;
  Responsables: string;
  Surveillants: string;
}

const readTemplateFile = async (file: File): Promise<ArrayBuffer> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

const generateDocx = async (templateBuffer: ArrayBuffer, data: DocData): Promise<ArrayBuffer> => {
  // Load the template
  const zip = new PizZip(templateBuffer);
  
  // Create Docxtemplater instance
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
  });
  
  // Render the document with data
  doc.render(data);
  
  // Generate output
  const content = doc.getZip().generate({
    type: 'arraybuffer',
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    compression: 'DEFLATE',
  });
  
  return content;
};

const mergeDocuments = async (documents: ArrayBuffer[]): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    try {
      // Convert ArrayBuffer to binary string for DocxMerger
      const binaryDocs = documents.map(buffer => {
        const array = new Uint8Array(buffer);
        let binary = '';
        for (let i = 0; i < array.length; i++) {
          binary += String.fromCharCode(array[i]);
        }
        return binary;
      });

      const merger = new DocxMerger({}, binaryDocs);
      
      merger.save('blob', (data: Blob) => {
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const processDocuments = async ({
  excelFile,
  pvTemplate,
  chemiseTemplate,
  enveloppeTemplate,
  settings,
  onProgress,
}: ProcessingParams): Promise<GeneratedDocument[]> => {
  try {
    // Extract data from Excel
    onProgress(10);
    const sheetData = await extractSheetData(excelFile, settings.sheetName);
    
    onProgress(20);
    
    // Read template files
    const [pvTemplateBuffer, chemiseTemplateBuffer, enveloppeTemplateBuffer] = await Promise.all([
      readTemplateFile(pvTemplate),
      readTemplateFile(chemiseTemplate),
      readTemplateFile(enveloppeTemplate),
    ]);
    
    onProgress(30);
    
    // Generate documents
    const generatedDocuments: GeneratedDocument[] = [];
    const pvDocs: ArrayBuffer[] = [];
    const chemiseDocs: ArrayBuffer[] = [];
    const enveloppeDocs: ArrayBuffer[] = [];
    
    // Process each row
    for (let i = 0; i < sheetData.length; i++) {
      const rowData = sheetData[i];
      
      // Create doc data
      const docData: DocData = {
        session: settings.session,
        Semestre: settings.semestre,
        Year: settings.year,
        controlType: settings.controlType,
        Dates: rowData.Dates || '',
        Locaux: rowData.Locaux || '',
        Heure: rowData.Heure || '',
        Module: rowData.Module || '',
        Coordinateur: rowData.Coordinateur || '',
        Responsables: rowData.Responsables || '',
        Surveillants: rowData.Surveillants || '',
      };
      
      // Generate documents
      const pvDoc = await generateDocx(pvTemplateBuffer, docData);
      const chemiseDoc = await generateDocx(chemiseTemplateBuffer, docData);
      const enveloppeDoc = await generateDocx(enveloppeTemplateBuffer, docData);
      
      // Create URLs for individual documents
      const pvUrl = URL.createObjectURL(new Blob([pvDoc], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
      const chemiseUrl = URL.createObjectURL(new Blob([chemiseDoc], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
      const enveloppeUrl = URL.createObjectURL(new Blob([enveloppeDoc], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
      
      // Store generated documents
      generatedDocuments.push({
        name: `PV_${docData.Module}_${i + 1}.docx`,
        type: 'pv',
        url: pvUrl,
      });
      
      generatedDocuments.push({
        name: `Chemise_${docData.Module}_${i + 1}.docx`,
        type: 'chemise',
        url: chemiseUrl,
      });
      
      generatedDocuments.push({
        name: `Enveloppe_${docData.Module}_${i + 1}.docx`,
        type: 'enveloppe',
        url: enveloppeUrl,
      });
      
      // Store for merging
      pvDocs.push(pvDoc);
      chemiseDocs.push(chemiseDoc);
      enveloppeDocs.push(enveloppeDoc);
      
      onProgress(30 + Math.floor((i / sheetData.length) * 50));
    }
    
    // Merge documents
    onProgress(80);
    
    const [mergedPvsDoc, mergedChemisesDoc, mergedEnveloppesDoc] = await Promise.all([
      mergeDocuments(pvDocs),
      mergeDocuments(chemiseDocs),
      mergeDocuments(enveloppeDocs),
    ]);
    
    const mergedPvsUrl = URL.createObjectURL(mergedPvsDoc);
    const mergedChemisesUrl = URL.createObjectURL(mergedChemisesDoc);
    const mergedEnveloppesUrl = URL.createObjectURL(mergedEnveloppesDoc);
    
    // Add merged documents
    generatedDocuments.push({
      name: `${settings.semestre}_PVs_Merged.docx`,
      type: 'merged',
      url: mergedPvsUrl,
    });
    
    generatedDocuments.push({
      name: `${settings.semestre}_Chemises_Merged.docx`,
      type: 'merged',
      url: mergedChemisesUrl,
    });
    
    generatedDocuments.push({
      name: `${settings.semestre}_Enveloppes_Merged.docx`,
      type: 'merged',
      url: mergedEnveloppesUrl,
    });
    
    // Save generation log
    saveGenerationLog(settings, {
      pv: pvDocs.length,
      chemise: chemiseDocs.length,
      enveloppe: enveloppeDocs.length,
      merged: 3, // One merged document for each type
    });
    
    onProgress(100);
    
    return generatedDocuments;
  } catch (error) {
    console.error('Error processing documents:', error);
    throw error;
  }
};