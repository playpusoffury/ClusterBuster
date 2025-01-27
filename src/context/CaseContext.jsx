import React, { createContext, useState, useContext } from 'react';

const CaseContext = createContext();

export function CaseProvider({ children }) {
  const [cases, setCases] = useState([]);

  return (
    <CaseContext.Provider value={{ cases, setCases }}>
      {children}
    </CaseContext.Provider>
  );
}

export function useCases() {
  const context = useContext(CaseContext);
  if (!context) {
    throw new Error('useCases must be used within a CaseProvider');
  }
  return context;
}
