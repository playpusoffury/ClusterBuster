import React from 'react';
import { useCases } from '../context/CaseContext';
import { useConnections } from '../context/ConnectionContext';

export default function Dashboard() {
  const { cases } = useCases();
  const { aiStatus, ragStatus } = useConnections();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* AI Model Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${aiStatus.connected ? 'bg-green-600' : 'bg-red-600'}`}>
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Model Status</p>
              <div className="flex flex-col">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {aiStatus.connected ? 'Connected' : 'Disconnected'}
                </p>
                {aiStatus.connected && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {aiStatus.type}: {aiStatus.model}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Knowledge Base Status */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${ragStatus.connected ? 'bg-green-600' : 'bg-red-600'}`}>
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Knowledge Base Status</p>
              <div className="flex flex-col">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {ragStatus.connected ? 'Connected' : 'Disconnected'}
                </p>
                {ragStatus.connected && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {ragStatus.url}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Total Cases */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-indigo-600">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Cases</p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{cases.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
