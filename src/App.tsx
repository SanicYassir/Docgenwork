import React from 'react';
import { useFilesContext } from './contexts/FilesContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FileUpload } from './components/FileUpload';
import { Settings } from './components/Settings';
import { Processing } from './components/Processing';
import { DocumentList } from './components/DocumentList';
import { StepIndicator } from './components/StepIndicator';

function App() {
  const { step } = useFilesContext();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        <StepIndicator />
        
        <div className="mt-8">
          {step === 'upload' && <FileUpload />}
          {step === 'settings' && <Settings />}
          {step === 'processing' && <Processing />}
          {step === 'download' && <DocumentList />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App;