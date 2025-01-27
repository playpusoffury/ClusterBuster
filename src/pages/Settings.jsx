import React, { useState, useEffect } from 'react';
import { Switch } from '@headlessui/react';
import clsx from 'clsx';
import { useConnections } from '../context/ConnectionContext';

const SERVER_CONFIGS = {
  'Ollama': {
    defaultUrl: 'http://10.0.0.31:11434',
    endpoint: '/api/tags'
  },
  'LMStudio': {
    defaultUrl: 'http://localhost:1234',
    endpoint: '/v1/models'
  },
  'DeepSeek': {
    defaultUrl: 'https://api.deepseek.com/v1',
    endpoint: '/models'
  },
  'Azure OpenAI': {
    defaultUrl: 'https://{resource-name}.openai.azure.com',
    endpoint: '/openai/deployments'
  },
  'Anthropic': {
    defaultUrl: 'https://api.anthropic.com',
    endpoint: '/v1/models'
  }
};

export default function Settings() {
  const { setAiStatus, setRagStatus } = useConnections();

  // AI Server states
  const [serverType, setServerType] = useState('Ollama');
  const [serverUrl, setServerUrl] = useState(SERVER_CONFIGS['Ollama'].defaultUrl);
  const [selectedModel, setSelectedModel] = useState('');
  const [models, setModels] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // API Keys
  const [deepseekApiKey, setDeepseekApiKey] = useState('');
  const [azureApiKey, setAzureApiKey] = useState('');
  const [azureResourceName, setAzureResourceName] = useState('');
  const [anthropicApiKey, setAnthropicApiKey] = useState('');

  // Theme state
  const [isDark, setIsDark] = useState(document.documentElement.classList.contains('dark'));

  // File import state
  const [importFile, setImportFile] = useState(null);
  
  // RAG Database states
  const [ragServerUrl, setRagServerUrl] = useState('http://localhost:8080');
  const [ragLoading, setRagLoading] = useState(false);
  const [ragError, setRagError] = useState('');

  useEffect(() => {
    // Update server URL when server type changes
    setServerUrl(SERVER_CONFIGS[serverType].defaultUrl);
    setSelectedModel('');
    setModels([]);
    setError('');
  }, [serverType]);

  const handleServerTypeChange = (e) => {
    const newServerType = e.target.value;
    setServerType(newServerType);
    
    // Reset API keys when changing server type
    setDeepseekApiKey('');
    setAzureApiKey('');
    setAzureResourceName('');
    setAnthropicApiKey('');

    // Reset AI connection status
    setAiStatus({
      connected: false,
      type: '',
      model: ''
    });
  };

  const handleSetModel = () => {
    if (!selectedModel) {
      setError('Please select a model first');
      return;
    }

    setAiStatus(prev => ({
      ...prev,
      model: selectedModel
    }));
  };

  const testConnection = async () => {
    setLoading(true);
    setError('');
    setModels([]);

    try {
      const endpoint = SERVER_CONFIGS[serverType].endpoint;
      const url = `${serverUrl}${endpoint}`;
      
      const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      };

      // Add API keys based on server type
      switch (serverType) {
        case 'DeepSeek':
          headers['Authorization'] = `Bearer ${deepseekApiKey}`;
          break;
        case 'Azure OpenAI':
          headers['api-key'] = azureApiKey;
          break;
        case 'Anthropic':
          headers['x-api-key'] = anthropicApiKey;
          break;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle different response formats
      let modelList = [];
      switch (serverType) {
        case 'Ollama':
          modelList = data.models || [];
          break;
        case 'Azure OpenAI':
          modelList = data.value?.map(d => d.id) || [];
          break;
        case 'Anthropic':
          modelList = data.models || [];
          break;
        default:
          modelList = data.data || [];
      }
      
      setModels(modelList);
      setAiStatus({
        connected: true,
        type: serverType,
        model: selectedModel || (modelList.length > 0 ? modelList[0] : '')
      });
    } catch (err) {
      setError(`Failed to connect to server: ${err.message}`);
      setAiStatus({
        connected: false,
        type: '',
        model: ''
      });
    } finally {
      setLoading(false);
    }
  };

  const testRagConnection = async () => {
    setRagLoading(true);
    setRagError('');
    
    try {
      const response = await fetch(`${ragServerUrl}/v1/.well-known/ready`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      setRagStatus({
        connected: true,
        url: ragServerUrl
      });
    } catch (err) {
      setRagError(`Failed to connect to Knowledge Base server: ${err.message}`);
      setRagStatus({
        connected: false,
        url: ''
      });
    } finally {
      setRagLoading(false);
    }
  };

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const handleImport = () => {
    // Handle knowledge base import
  };

  const handleExport = () => {
    // Handle knowledge base export
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold leading-7 text-gray-900 dark:text-white sm:truncate sm:text-3xl sm:tracking-tight">
        Settings
      </h2>

      {/* AI Server Configuration */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
          AI Server Configuration
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Server Type
            </label>
            <select
              value={serverType}
              onChange={handleServerTypeChange}
              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {Object.keys(SERVER_CONFIGS).map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Server URL
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <input
                type="text"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder={SERVER_CONFIGS[serverType].defaultUrl}
              />
            </div>
          </div>

          {/* API Key inputs for specific server types */}
          {(serverType === 'DeepSeek' || serverType === 'Azure OpenAI' || serverType === 'Anthropic') && (
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                Authentication
              </h4>

              {serverType === 'Azure OpenAI' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Resource Name
                    </label>
                    <input
                      type="text"
                      value={azureResourceName}
                      onChange={(e) => setAzureResourceName(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter your Azure resource name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      API Key
                    </label>
                    <input
                      type="password"
                      value={azureApiKey}
                      onChange={(e) => setAzureApiKey(e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter your Azure API key"
                    />
                  </div>
                </>
              )}

              {serverType === 'DeepSeek' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={deepseekApiKey}
                    onChange={(e) => setDeepseekApiKey(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter your DeepSeek API key"
                  />
                </div>
              )}

              {serverType === 'Anthropic' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={anthropicApiKey}
                    onChange={(e) => setAnthropicApiKey(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="Enter your Anthropic API key"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={testConnection}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Connecting...' : 'Connect'}
            </button>
          </div>

          {error && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              AI Model
            </label>
            <div className="mt-1 space-y-2">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                disabled={models.length === 0}
              >
                <option value="">Select a model</option>
                {models.map((model, index) => (
                  <option key={index} value={model}>
                    {model}
                  </option>
                ))}
              </select>
              <div className="flex justify-end">
                <button
                  onClick={handleSetModel}
                  disabled={!selectedModel}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                >
                  Set Model
                </button>
              </div>
            </div>
            {models.length === 0 && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Connect to a server to view available models
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Knowledge Base Management */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
          Knowledge Base Management
        </h3>
        
        <div className="space-y-6">
          {/* Knowledge Base Server Settings */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
              Knowledge Base Server
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Server URL
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={ragServerUrl}
                    onChange={(e) => setRagServerUrl(e.target.value)}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="http://localhost:8080"
                  />
                  <button
                    onClick={testRagConnection}
                    disabled={ragLoading}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {ragLoading ? 'Connecting...' : 'Connect'}
                  </button>
                </div>
                {ragError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                    {ragError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Import/Export Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Import Knowledge Base
              </label>
              <div className="mt-1 flex items-center space-x-4">
                <input
                  type="file"
                  onChange={(e) => setImportFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 dark:text-gray-400
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-indigo-50 file:text-indigo-700
                    dark:file:bg-indigo-900 dark:file:text-indigo-300
                    hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800"
                />
                <button
                  onClick={handleImport}
                  disabled={!importFile}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  Import
                </button>
              </div>
            </div>

            <div>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Export Knowledge Base
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
          Theme Settings
        </h3>
        
        <div className="flex items-center">
          <Switch
            checked={isDark}
            onChange={toggleTheme}
            className={clsx(
              isDark ? 'bg-indigo-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            )}
          >
            <span className="sr-only">Toggle dark mode</span>
            <span
              className={clsx(
                isDark ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
              )}
            >
              <span
                className={clsx(
                  isDark
                    ? 'opacity-0 duration-100 ease-out'
                    : 'opacity-100 duration-200 ease-in',
                  'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                )}
                aria-hidden="true"
              >
                <svg
                  className="h-3 w-3 text-gray-400"
                  fill="none"
                  viewBox="0 0 12 12"
                >
                  <path
                    d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span
                className={clsx(
                  isDark
                    ? 'opacity-100 duration-200 ease-in'
                    : 'opacity-0 duration-100 ease-out',
                  'absolute inset-0 flex h-full w-full items-center justify-center transition-opacity'
                )}
                aria-hidden="true"
              >
                <svg
                  className="h-3 w-3 text-indigo-600"
                  fill="currentColor"
                  viewBox="0 0 12 12"
                >
                  <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
                </svg>
              </span>
            </span>
          </Switch>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
            Dark Mode
          </span>
        </div>
      </div>
    </div>
  );
}
