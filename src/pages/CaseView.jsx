import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import clsx from 'clsx';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function CaseView() {
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [timeWindow, setTimeWindow] = useState({
    startDate: new Date('2020-02-06'),
    endDate: new Date('2020-08-16'),
    startTime: '10:43 PM',
    endTime: '10:59 PM'
  });

  // Knowledge Base Entry State
  const [kbEntry, setKbEntry] = useState({
    title: '',
    categories: '',
    summary: ''
  });

  // Resolution State
  const [resolution, setResolution] = useState({
    status: 'Resolved',
    notes: ''
  });

  const categories = [
    'SQL AG',
    'CSV Backup',
    'Resource Failure',
    'CSV AutoPause',
    'Node Join',
    'Network Event'
  ];

  const handleAddToKnowledgeBase = () => {
    // Handle adding to knowledge base
    console.log('Adding to knowledge base:', kbEntry);
  };

  const handleResolveCase = () => {
    // Handle case resolution
    console.log('Resolving case:', resolution);
  };

  return (
    <div className="space-y-6">
      <Tab.Group>
        <Tab.List className="flex space-x-4 border-b border-gray-200 dark:border-gray-700">
          {['Case Data', 'Analysis', 'Root Cause Analysis', 'Case Chat', 'Resolve Case'].map((tab, index) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                classNames(
                  'px-3 py-2 text-sm font-medium leading-5',
                  'focus:outline-none',
                  selected
                    ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                )
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {/* Case Data Panel */}
          <Tab.Panel className="space-y-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
              Case Data Content
            </h3>
          </Tab.Panel>

          {/* Analysis Panel */}
          <Tab.Panel className="space-y-6">
            {/* Time Window Selector */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Adjust Window</h4>
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Events from {timeWindow.startDate.toLocaleDateString()} {timeWindow.startTime}
                    <br />
                    to {timeWindow.endDate.toLocaleDateString()} {timeWindow.endTime}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <span className="sr-only">Select start date</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="inline-flex items-center p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                    <span className="sr-only">Select end date</span>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Cluster Analysis */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Cluster Analysis
              </h3>
              
              {/* Swimlane Graph */}
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 20, bottom: 20, left: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      type="number"
                      dataKey="timestamp"
                      domain={['auto', 'auto']}
                      tickFormatter={(unixTime) => new Date(unixTime).toLocaleDateString()}
                    />
                    <YAxis
                      type="category"
                      dataKey="type"
                      categories={categories}
                      tick={{ fill: '#6B7280' }}
                    />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Event Table */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Showing log lines
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        50K
                      </button>
                      <button className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                        75K
                      </button>
                      <button className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                        100K
                      </button>
                      <button className="px-3 py-1 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        Cluster Config
                      </button>
                      <button className="px-3 py-1 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                        UTC
                      </button>
                      <button className="px-3 py-1 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                        Local
                      </button>
                    </div>
                  </div>
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          DateTime (UTC)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Node
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Level
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Event
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Comp
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          KB Article
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* Root Cause Analysis Panel */}
          <Tab.Panel className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                  Root Cause Analysis
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  {/* Content will be populated by AI analysis */}
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* Case Chat Panel */}
          <Tab.Panel className="space-y-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                  Case Chat
                </h3>
                {/* Chat interface will be implemented here */}
              </div>
            </div>
          </Tab.Panel>

          {/* Resolve Case Panel - Split into two cards */}
          <Tab.Panel className="space-y-6">
            {/* Sterilize and Add to Knowledge Base Card */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                  Sterilize and Add to Knowledge Base
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Knowledge Base Entry Title
                    </label>
                    <input
                      type="text"
                      value={kbEntry.title}
                      onChange={(e) => setKbEntry({ ...kbEntry, title: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter a title for the knowledge base entry"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Categories
                    </label>
                    <input
                      type="text"
                      value={kbEntry.categories}
                      onChange={(e) => setKbEntry({ ...kbEntry, categories: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter categories separated by commas"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Summary
                    </label>
                    <textarea
                      rows={4}
                      value={kbEntry.summary}
                      onChange={(e) => setKbEntry({ ...kbEntry, summary: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Provide a summary of the knowledge to be stored"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleAddToKnowledgeBase}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Add to Knowledge Base
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Resolve Case Card */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
                  Resolve Case
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Resolution Status
                    </label>
                    <select
                      value={resolution.status}
                      onChange={(e) => setResolution({ ...resolution, status: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option>Resolved</option>
                      <option>Resolved with Workaround</option>
                      <option>Not Resolved</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Resolution Notes
                    </label>
                    <textarea
                      rows={4}
                      value={resolution.notes}
                      onChange={(e) => setResolution({ ...resolution, notes: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter resolution notes"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleResolveCase}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Resolve Case
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
