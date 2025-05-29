import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 py-4 mt-auto">
      <div className="container mx-auto px-4 text-center text-gray-600 text-sm max-w-5xl">
        <p>Document Generator &copy; {new Date().getFullYear()} - All rights reserved</p>
      </div>
    </footer>
  );
};