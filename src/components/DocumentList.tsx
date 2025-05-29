import React, { useState } from 'react';
import { useFilesContext } from '../contexts/FilesContext';
import { ArrowLeft, Download, FileText, File, FileArchive, Filter, Clock } from 'lucide-react';
import { getGenerationLogs } from '../utils/logUtils';

type DocumentType = 'all' | 'pv' | 'chemise' | 'enveloppe' | 'merged';

export const DocumentList: React.FC = () => {
  const { generatedDocuments, setStep, settings } = useFilesContext();
  const [selectedType, setSelectedType] = useState<DocumentType>('all');
  const [showHistory, setShowHistory] = useState(false);
  
  const logs = getGenerationLogs();

  const getIcon = (type: string) => {
    switch (type) {
      case 'pv':
        return <FileText size={20} className="text-blue-500" />;
      case 'chemise':
        return <File size={20} className="text-amber-500" />;
      case 'enveloppe':
        return <File size={20} className="text-teal-500" />;
      case 'merged':
        return <FileArchive size={20} className="text-purple-500" />;
      default:
        return <File size={20} className="text-gray-500" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'pv':
        return 'PV Document';
      case 'chemise':
        return 'Chemise Document';
      case 'enveloppe':
        return 'Enveloppe Document';
      case 'merged':
        return 'Merged Document';
      default:
        return 'Document';
    }
  };

  const filteredDocuments = selectedType === 'all' 
    ? generatedDocuments 
    : generatedDocuments.filter(doc => doc.type === selectedType);
  
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Generated Documents</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-1 text-gray-600 hover:text-blue-600"
            >
              <Clock size={16} />
              <span className="text-sm">History</span>
            </button>
            <div className="flex items-center space-x-2">
              <Filter size={16} className="text-gray-500" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as DocumentType)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Documents</option>
                <option value="pv">PV Documents</option>
                <option value="chemise">Chemise Documents</option>
                <option value="enveloppe">Enveloppe Documents</option>
                <option value="merged">Merged Documents</option>
              </select>
            </div>
          </div>
        </div>
        
        {showHistory ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Generation History</h3>
            {logs.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No generation history available.</p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Semestre
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Control Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Documents Generated
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logs.map((log, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(log.timestamp).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {log.semestre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {log.controlType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="flex space-x-3">
                            <span className="text-blue-600">{log.documentCount.pv} PVs</span>
                            <span className="text-amber-600">{log.documentCount.chemise} Chemises</span>
                            <span className="text-teal-600">{log.documentCount.enveloppe} Enveloppes</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg">
              <h3 className="text-green-800 font-medium mb-2">Processing Complete!</h3>
              <p className="text-green-700 text-sm">
                All documents for {settings.semestre} have been generated successfully. 
                You can now download your files.
              </p>
            </div>
            
            <div className="space-y-4">
              {filteredDocuments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No documents found for the selected type.</p>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          File Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDocuments.map((doc, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getIcon(doc.type)}
                              <span className="ml-2 text-sm text-gray-700">{getTypeName(doc.type)}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {doc.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <a 
                              href={doc.url}
                              download={doc.name}
                              className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              <Download size={16} className="mr-1" />
                              Download
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
      
      <div className="flex justify-between">
        <button
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center"
          onClick={() => setStep('settings')}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Settings
        </button>
        
        <button
          className="px-5 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Start New Project
        </button>
      </div>
    </div>
  );
};