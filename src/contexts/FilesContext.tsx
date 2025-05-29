import React, { createContext, useContext, useState } from 'react';
import { WorkSheet } from 'xlsx';

export type Step = 'upload' | 'settings' | 'processing' | 'download';

export interface TemplateFile {
  name: string;
  file: File;
}

export interface GeneratedDocument {
  name: string;
  type: 'pv' | 'chemise' | 'enveloppe' | 'merged';
  url: string;
}

export interface FormSettings {
  semestre: string;
  year: string;
  controlType: string;
  session: string;
  sheetName: string;
}

interface FilesContextType {
  step: Step;
  setStep: (step: Step) => void;
  excelFile: File | null;
  setExcelFile: (file: File | null) => void;
  templateFiles: {
    pv: File | null;
    chemise: File | null;
    enveloppe: File | null;
  };
  setTemplateFile: (type: 'pv' | 'chemise' | 'enveloppe', file: File | null) => void;
  sheetData: WorkSheet | null;
  setSheetData: (data: WorkSheet | null) => void;
  sheetNames: string[];
  setSheetNames: (names: string[]) => void;
  settings: FormSettings;
  setSettings: (settings: FormSettings) => void;
  generatedDocuments: GeneratedDocument[];
  setGeneratedDocuments: (docs: GeneratedDocument[]) => void;
  processingProgress: number;
  setProcessingProgress: (progress: number) => void;
}

const defaultSettings: FormSettings = {
  semestre: '',
  year: `Année Universitaire ${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
  controlType: 'Contrôle Final',
  session: 'Session Normale',
  sheetName: '',
};

const FilesContext = createContext<FilesContextType | undefined>(undefined);

export const FilesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState<Step>('upload');
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [templateFiles, setTemplateFiles] = useState<{
    pv: File | null;
    chemise: File | null;
    enveloppe: File | null;
  }>({
    pv: null,
    chemise: null,
    enveloppe: null,
  });
  const [sheetData, setSheetData] = useState<WorkSheet | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [settings, setSettings] = useState<FormSettings>(defaultSettings);
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocument[]>([]);
  const [processingProgress, setProcessingProgress] = useState(0);

  const setTemplateFile = (type: 'pv' | 'chemise' | 'enveloppe', file: File | null) => {
    setTemplateFiles(prev => ({
      ...prev,
      [type]: file,
    }));
  };

  return (
    <FilesContext.Provider
      value={{
        step,
        setStep,
        excelFile,
        setExcelFile,
        templateFiles,
        setTemplateFile,
        sheetData,
        setSheetData,
        sheetNames,
        setSheetNames,
        settings,
        setSettings,
        generatedDocuments,
        setGeneratedDocuments,
        processingProgress,
        setProcessingProgress,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};

export const useFilesContext = () => {
  const context = useContext(FilesContext);
  if (context === undefined) {
    throw new Error('useFilesContext must be used within a FilesProvider');
  }
  return context;
};