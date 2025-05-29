import React, { useState } from 'react';
import { FileText, History } from 'lucide-react';
import { HistoryModal } from './HistoryModal';

export const Header: React.FC = () => {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <>
      <header className="bg-blue-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-5 flex justify-between items-center max-w-5xl">
          <div className="flex items-center space-x-3">
            <FileText size={28} className="text-amber-400" />
            <div>
              <h1 className="text-xl font-semibold">Document Generator</h1>
              <p className="text-xs text-blue-200">Generate examination documents with ease</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setShowHistory(true)}
              className="px-3 py-1.5 text-sm rounded-md bg-blue-800 hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <History size={16} />
              <span>History</span>
            </button>
            <button 
              className="px-3 py-1.5 text-sm rounded-md bg-blue-800 hover:bg-blue-700 transition-colors"
              onClick={() => window.location.reload()}
            >
              New Project
            </button>
          </div>
        </div>
      </header>

      <HistoryModal isOpen={showHistory} onClose={() => setShowHistory(false)} />
    </>
  );
};