import { FormSettings } from '../contexts/FilesContext';

interface GenerationLog {
  timestamp: string;
  semestre: string;
  year: string;
  controlType: string;
  session: string;
  documentCount: {
    pv: number;
    chemise: number;
    enveloppe: number;
    merged: number;
  };
}

const STORAGE_KEY = 'document_generator_logs';

export const saveGenerationLog = (settings: FormSettings, documentCounts: GenerationLog['documentCount']): void => {
  try {
    const existingLogs: GenerationLog[] = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    const newLog: GenerationLog = {
      timestamp: new Date().toISOString(),
      semestre: settings.semestre,
      year: settings.year,
      controlType: settings.controlType,
      session: settings.session,
      documentCount: documentCounts,
    };
    
    existingLogs.unshift(newLog); // Add new log at the beginning
    
    // Keep only the last 100 logs
    const trimmedLogs = existingLogs.slice(0, 100);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmedLogs));
  } catch (error) {
    console.error('Error saving generation log:', error);
  }
};

export const getGenerationLogs = (): GenerationLog[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Error reading generation logs:', error);
    return [];
  }
};