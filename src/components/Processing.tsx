import React, { useEffect } from 'react';
import { useFilesContext } from '../contexts/FilesContext';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { processDocuments } from '../utils/documentProcessor';

export const Processing: React.FC = () => {
  const { 
    setStep, 
    excelFile,
    templateFiles,
    settings,
    processingProgress,
    setProcessingProgress,
    setGeneratedDocuments
  } = useFilesContext();

  useEffect(() => {
    const runProcessing = async () => {
      if (!excelFile || !templateFiles.pv || !templateFiles.chemise || !templateFiles.enveloppe) {
        return;
      }

      try {
        const documents = await processDocuments({
          excelFile,
          pvTemplate: templateFiles.pv,
          chemiseTemplate: templateFiles.chemise,
          enveloppeTemplate: templateFiles.enveloppe,
          settings,
          onProgress: (progress) => setProcessingProgress(progress),
        });

        setGeneratedDocuments(documents);
        
        // Delay moving to the next step to show progress completion
        setTimeout(() => {
          setStep('download');
        }, 1000);
      } catch (error) {
        console.error('Error processing documents:', error);
        setProcessingProgress(0);
      }
    };

    runProcessing();
  }, [excelFile, templateFiles, settings, setGeneratedDocuments, setProcessingProgress, setStep]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Processing Documents</h2>
        
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="flex items-center justify-center mb-6">
              <Loader2 size={48} className="text-blue-500 animate-spin" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {processingProgress < 100 
                ? 'Generating documents...' 
                : 'Processing complete!'
              }
            </h3>
            
            <p className="text-gray-600 mb-6">
              {processingProgress < 100 
                ? 'Please wait while we process your documents.' 
                : 'All documents have been generated successfully.'
              }
            </p>
            
            <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5 mb-1">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${processingProgress}%` }}
              />
            </div>
            
            <p className="text-sm text-gray-500">{processingProgress}% complete</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center"
          onClick={() => setStep('settings')}
          disabled={processingProgress > 0 && processingProgress < 100}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </button>
        
        <button
          className={`
            px-5 py-2 rounded-md text-white font-medium flex items-center
            transition-all duration-200
            ${processingProgress === 100 
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
              : 'bg-gray-400 cursor-not-allowed opacity-70'
            }
          `}
          disabled={processingProgress < 100}
          onClick={() => processingProgress === 100 && setStep('download')}
        >
          View Results
          <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};