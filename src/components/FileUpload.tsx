import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useFilesContext } from '../contexts/FilesContext';
import { FileSpreadsheet, FileText, AlertCircle, CheckCircle2, X } from 'lucide-react';
import { readExcelFile } from '../utils/excelUtils';

export const FileUpload: React.FC = () => {
  const { 
    excelFile, setExcelFile, 
    templateFiles, setTemplateFile,
    setSheetNames, setStep,
    setSettings
  } = useFilesContext();

  const onExcelDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setExcelFile(file);
      
      try {
        const { sheetNames, defaultSemestre } = await readExcelFile(file);
        setSheetNames(sheetNames);
        
        // Automatically set the semester if found
        if (defaultSemestre) {
          setSettings(prev => ({
            ...prev,
            semestre: defaultSemestre,
            sheetName: defaultSemestre // Also set the sheet name to match
          }));
        }
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    }
  }, [setExcelFile, setSheetNames, setSettings]);

  const onTemplateDrop = useCallback((type: 'pv' | 'chemise' | 'enveloppe') => {
    return async (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setTemplateFile(type, acceptedFiles[0]);
      }
    };
  }, [setTemplateFile]);

  const removeFile = (fileType: 'excel' | 'pv' | 'chemise' | 'enveloppe') => {
    if (fileType === 'excel') {
      setExcelFile(null);
      setSheetNames([]);
      setSettings(prev => ({
        ...prev,
        semestre: '',
        sheetName: ''
      }));
    } else {
      setTemplateFile(fileType, null);
    }
  };

  const { getRootProps: getExcelRootProps, getInputProps: getExcelInputProps } = useDropzone({
    onDrop: onExcelDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
    },
    maxFiles: 1,
  });

  const { getRootProps: getPvRootProps, getInputProps: getPvInputProps } = useDropzone({
    onDrop: onTemplateDrop('pv'),
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const { getRootProps: getChemiseRootProps, getInputProps: getChemiseInputProps } = useDropzone({
    onDrop: onTemplateDrop('chemise'),
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const { getRootProps: getEnveloppeRootProps, getInputProps: getEnveloppeInputProps } = useDropzone({
    onDrop: onTemplateDrop('enveloppe'),
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const renderFileInfo = (file: File | null, fileType: 'excel' | 'pv' | 'chemise' | 'enveloppe') => {
    if (!file) return null;
    
    return (
      <div className="flex items-center mt-2 bg-blue-50 p-2 rounded">
        <CheckCircle2 className="text-green-500 mr-2" size={16} />
        <span className="text-sm text-gray-800 truncate">{file.name}</span>
        <button 
          onClick={() => removeFile(fileType)} 
          className="ml-auto text-gray-500 hover:text-red-500"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  const canContinue = excelFile && templateFiles.pv && templateFiles.chemise && templateFiles.enveloppe;

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Upload Files</h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Excel Data File</label>
            <div 
              {...getExcelRootProps()} 
              className={`
                border-2 border-dashed rounded-lg p-6 
                flex flex-col items-center justify-center
                transition-colors cursor-pointer
                ${excelFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
              `}
            >
              <input {...getExcelInputProps()} />
              <FileSpreadsheet 
                size={36} 
                className={excelFile ? 'text-green-500' : 'text-blue-500'}
              />
              <p className="mt-2 text-sm text-center text-gray-600">
                {excelFile ? 'File uploaded successfully!' : 'Drag & drop your Excel file here, or click to select'}
              </p>
              <p className="mt-1 text-xs text-gray-500">Accepted formats: .xlsx, .xls</p>
            </div>
            {renderFileInfo(excelFile, 'excel')}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PV Template</label>
              <div 
                {...getPvRootProps()} 
                className={`
                  border-2 border-dashed rounded-lg p-4
                  flex flex-col items-center justify-center
                  transition-colors cursor-pointer min-h-[120px]
                  ${templateFiles.pv ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
                `}
              >
                <input {...getPvInputProps()} />
                <FileText 
                  size={24} 
                  className={templateFiles.pv ? 'text-green-500' : 'text-blue-500'}
                />
                <p className="mt-2 text-xs text-center text-gray-600">
                  {templateFiles.pv ? 'Template added' : 'PV Template (.docx)'}
                </p>
              </div>
              {renderFileInfo(templateFiles.pv, 'pv')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chemise Template</label>
              <div 
                {...getChemiseRootProps()} 
                className={`
                  border-2 border-dashed rounded-lg p-4
                  flex flex-col items-center justify-center
                  transition-colors cursor-pointer min-h-[120px]
                  ${templateFiles.chemise ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
                `}
              >
                <input {...getChemiseInputProps()} />
                <FileText 
                  size={24} 
                  className={templateFiles.chemise ? 'text-green-500' : 'text-blue-500'}
                />
                <p className="mt-2 text-xs text-center text-gray-600">
                  {templateFiles.chemise ? 'Template added' : 'Chemise Template (.docx)'}
                </p>
              </div>
              {renderFileInfo(templateFiles.chemise, 'chemise')}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Enveloppe Template</label>
              <div 
                {...getEnveloppeRootProps()} 
                className={`
                  border-2 border-dashed rounded-lg p-4
                  flex flex-col items-center justify-center
                  transition-colors cursor-pointer min-h-[120px]
                  ${templateFiles.enveloppe ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}
                `}
              >
                <input {...getEnveloppeInputProps()} />
                <FileText 
                  size={24} 
                  className={templateFiles.enveloppe ? 'text-green-500' : 'text-blue-500'}
                />
                <p className="mt-2 text-xs text-center text-gray-600">
                  {templateFiles.enveloppe ? 'Template added' : 'Enveloppe Template (.docx)'}
                </p>
              </div>
              {renderFileInfo(templateFiles.enveloppe, 'enveloppe')}
            </div>
          </div>
        </div>
      </div>

      {!canContinue && (
        <div className="flex items-center p-4 bg-amber-50 text-amber-700 rounded-lg">
          <AlertCircle size={20} className="mr-2 flex-shrink-0" />
          <p className="text-sm">Please upload all required files to continue.</p>
        </div>
      )}

      <div className="flex justify-end">
        <button
          className={`
            px-5 py-2 rounded-md text-white font-medium
            transition-all duration-200
            ${canContinue 
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
              : 'bg-gray-400 cursor-not-allowed opacity-70'
            }
          `}
          disabled={!canContinue}
          onClick={() => canContinue && setStep('settings')}
        >
          Continue to Settings
        </button>
      </div>
    </div>
  );
};