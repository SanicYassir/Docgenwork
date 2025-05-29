import React from 'react';
import { useFilesContext } from '../contexts/FilesContext';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const Settings: React.FC = () => {
  const { 
    settings, setSettings, 
    sheetNames, 
    setStep 
  } = useFilesContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const canContinue = 
    settings.semestre.trim() !== '' && 
    settings.year.trim() !== '' && 
    settings.controlType.trim() !== '' && 
    settings.session.trim() !== '' && 
    settings.sheetName !== '';

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Configure Settings</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="semestre" className="block text-sm font-medium text-gray-700 mb-2">
                Semestre
              </label>
              <input
                type="text"
                id="semestre"
                name="semestre"
                value={settings.semestre}
                onChange={handleChange}
                placeholder="e.g., S4 CI"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Year
              </label>
              <input
                type="text"
                id="year"
                name="year"
                value={settings.year}
                onChange={handleChange}
                placeholder="e.g., Année Universitaire 2024-2025"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="controlType" className="block text-sm font-medium text-gray-700 mb-2">
                Control Type
              </label>
              <select
                id="controlType"
                name="controlType"
                value={settings.controlType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Contrôle Final">Contrôle Final</option>
                <option value="Contrôle Continu">Contrôle Continu</option>
                <option value="Rattrapage">Rattrapage</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-2">
                Session
              </label>
              <select
                id="session"
                name="session"
                value={settings.session}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Session Normale">Session Normale</option>
                <option value="Session Rattrapage">Session Rattrapage</option>
              </select>
            </div>
          </div>
          
          <div>
            <label htmlFor="sheetName" className="block text-sm font-medium text-gray-700 mb-2">
              Excel Sheet
            </label>
            <select
              id="sheetName"
              name="sheetName"
              value={settings.sheetName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a sheet</option>
              {sheetNames.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Preview Settings</h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <div className="text-gray-600">Semestre:</div>
              <div className="font-medium">{settings.semestre || '—'}</div>
              
              <div className="text-gray-600">Year:</div>
              <div className="font-medium">{settings.year || '—'}</div>
              
              <div className="text-gray-600">Control Type:</div>
              <div className="font-medium">{settings.controlType}</div>
              
              <div className="text-gray-600">Session:</div>
              <div className="font-medium">{settings.session}</div>
              
              <div className="text-gray-600">Sheet:</div>
              <div className="font-medium">{settings.sheetName || '—'}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center"
          onClick={() => setStep('upload')}
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </button>
        
        <button
          className={`
            px-5 py-2 rounded-md text-white font-medium flex items-center
            transition-all duration-200
            ${canContinue 
              ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
              : 'bg-gray-400 cursor-not-allowed opacity-70'
            }
          `}
          disabled={!canContinue}
          onClick={() => canContinue && setStep('processing')}
        >
          Process Documents
          <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};