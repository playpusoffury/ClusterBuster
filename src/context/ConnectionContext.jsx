import React, { createContext, useState, useContext } from 'react';

const ConnectionContext = createContext();

export function ConnectionProvider({ children }) {
  const [aiStatus, setAiStatus] = useState({
    connected: false,
    model: '',
    type: ''
  });
  const [ragStatus, setRagStatus] = useState({
    connected: false,
    url: ''
  });

  return (
    <ConnectionContext.Provider value={{ aiStatus, setAiStatus, ragStatus, setRagStatus }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnections() {
  const context = useContext(ConnectionContext);
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionProvider');
  }
  return context;
}
