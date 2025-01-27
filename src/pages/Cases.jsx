import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Link } from 'react-router-dom';
import { useCases } from '../context/CaseContext';

const CASE_CATEGORIES = [
  'Windows Failover Cluster',
  'HCI Stack',
  'Azure Arc enabled Kubernetes Cluster',
  'AKSHCI Kubernetes Cluster'
];

export default function Cases() {
  const { cases, setCases } = useCases();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCase, setNewCase] = useState({
    caseId: '',
    category: '',
    synopsis: ''
  });
  const [error, setError] = useState('');

  const handleCreateCase = (e) => {
    e.preventDefault();
    if (!newCase.caseId || !newCase.category) {
      setError('Case ID and Category are required');
      return;
    }

    const currentDate = new Date().toISOString().split('T')[0];
    const createdCase = {
      ...newCase,
      status: 'Not Started',
      indexed: 'Not Started',
      analyzed: 'Not Started',
      created: currentDate
    };

    setCases([...cases, createdCase]);
    setIsModalOpen(false);
    setNewCase({ caseId: '', category: '', synopsis: '' });
    setError('');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
          Cases
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Case
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Case ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Indexed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Analyzed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Created</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {cases.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  No cases found. Create a new case to get started.
                </td>
              </tr>
            ) : (
              cases.map((caseItem) => (
                <tr key={caseItem.caseId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600 dark:text-indigo-400">
                    <Link to={`/cases/${caseItem.caseId}`}>{caseItem.caseId}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">{caseItem.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{caseItem.status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{caseItem.indexed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{caseItem.analyzed}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{caseItem.created}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="fixed inset-0 z-10 overflow-y-auto"
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <div className="relative bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Create New Case
            </Dialog.Title>

            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label htmlFor="caseId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Case ID
                </label>
                <input
                  type="text"
                  id="caseId"
                  value={newCase.caseId}
                  onChange={(e) => setNewCase({ ...newCase, caseId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  id="category"
                  value={newCase.category}
                  onChange={(e) => setNewCase({ ...newCase, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a category</option>
                  {CASE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="synopsis" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Synopsis
                </label>
                <textarea
                  id="synopsis"
                  value={newCase.synopsis}
                  onChange={(e) => setNewCase({ ...newCase, synopsis: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {error && (
                <p className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
