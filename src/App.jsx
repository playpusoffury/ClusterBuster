import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import Settings from './pages/Settings';
import CaseView from './pages/CaseView';
import { CaseProvider } from './context/CaseContext';
import { ConnectionProvider } from './context/ConnectionContext';

export default function App() {
  return (
    <ConnectionProvider>
      <CaseProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="cases" element={<Cases />} />
              <Route path="cases/:id" element={<CaseView />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </CaseProvider>
    </ConnectionProvider>
  );
}
