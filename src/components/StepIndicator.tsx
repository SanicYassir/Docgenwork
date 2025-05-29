import React from 'react';
import { useFilesContext } from '../contexts/FilesContext';
import { Upload, Settings2, Cog, Download } from 'lucide-react';

export const StepIndicator: React.FC = () => {
  const { step } = useFilesContext();
  
  const steps = [
    { id: 'upload', label: 'Upload Files', icon: Upload },
    { id: 'settings', label: 'Configure', icon: Settings2 },
    { id: 'processing', label: 'Processing', icon: Cog },
    { id: 'download', label: 'Download', icon: Download },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === step);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isActive = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;
          
          return (
            <div key={s.id} className="flex flex-col items-center relative">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isActive ? 'bg-blue-600 text-white' : ''}
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${!isActive && !isCompleted ? 'bg-gray-200 text-gray-500' : ''}
                  z-10 transition-all duration-300
                `}
              >
                <Icon size={20} />
              </div>
              <p className={`
                mt-2 text-sm font-medium
                ${isActive ? 'text-blue-600' : ''}
                ${isCompleted ? 'text-green-500' : ''}
                ${!isActive && !isCompleted ? 'text-gray-500' : ''}
              `}>
                {s.label}
              </p>
              
              {idx < steps.length - 1 && (
                <div className={`
                  absolute top-5 left-10 w-[calc(100%-1.25rem)] h-0.5
                  ${isCompleted && idx + 1 <= currentStepIndex ? 'bg-green-500' : 'bg-gray-200'}
                  transition-all duration-300
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};