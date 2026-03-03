import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ConnectDatabaseModal from "../components/ConnectDatabaseModal";
import VoiceSearchModal from '../components/VoiceSearchModal';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/ui/Loader';
import DbPreviewOption from '../components/ui/Db-preview';
import { SiPostgresql } from 'react-icons/si';
import { GrMysql } from 'react-icons/gr';
import { API_BASE_URL } from '../lib/api';

const DatabaseDashboard = () => {

  const dbTypeIconMap = {
    PostgreSQL: <SiPostgresql className="inline-block text-blue-600 mr-2" size={30} />,
    MySQL: <GrMysql className="inline-block text-blue-600 mr-2" size={25} />
  };
  const navigate = useNavigate();
  const [databases, setDatabases] = useState([]);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [processingVoice, setProcessingVoice] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [translations, setTranslations] = useState({
    title: 'Your Databases',
    connectButton: 'Connect Database',
    noData: 'No databases found',
    dbName: 'Database Name',
    dbType: 'Type',
    accessLevel: 'Access Level',
    lastAccessed: 'Last Accessed',
    readOnly: 'Read Only',
    readWrite: 'Read & Write',
    voiceSearch: 'Search by voice',
    actions: 'Actions',
    queryDatabase: 'Query database',
    preview: 'Preview',
    voiceQueryDb: 'Voice query database'
  });

  const fetchDatabases = async () => {
    setIsLoading(true);
    setError(null);

    try {
  const response = await fetch(`${API_BASE_URL}/api/database/list`, {
        method: 'GET',
        credentials: 'include', // ✅ this is critical for cookies to be sent
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch databases: ${response.statusText}`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Unexpected response format');
      }
      setDatabases(data);
    } catch (err) {
      console.error('Error fetching databases:', err);
      setError('Failed to load databases. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch of databases on component mount
  useEffect(() => {
    fetchDatabases();
  }, []);

  const handleConnectDatabase = () => {
    setShowConnectModal(true);
  };
  // Add database refresh on modal close to update list when new database is added or connected
  const handleModalClose = () => {
    fetchDatabases();
  };

  const handleDbVoiceQuery = (dbId, query) => {
    setProcessingVoice(true);

    if (!dbId) {
      setProcessingVoice(false);
      setErrorMessage('Database ID not found. Please try again.');
      return;
    }
    // Check if query is empty
    if (!query) {
      console.error("Query is empty");
      setProcessingVoice(false);
      setErrorMessage('Query cannot be empty. Please try again.');
      return;
    }
    // Make an API call to the backend database service
  fetch(`${API_BASE_URL}/api/query/process/${dbId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for authentication
      body: JSON.stringify({ transcript: query })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Database query failed');
        }
        return response.json();
      })
      .then(response => {
        console.log("Database query successful:", response.data);
        setProcessingVoice(false);

        // Save the data to sessionStorage
        try {
          sessionStorage.setItem('visualizationData', JSON.stringify(response.data));
          console.log(sessionStorage.getItem('visualizationData'))
          console.log("Data saved to sessionStorage successfully");
        } catch (err) {
          console.error("Error saving to sessionStorage:", err);
          // If storage fails, continue with navigation anyway
        }

        // On success, navigate to the choice page
        navigate('/table', { state: { visualizationData: response.data } });
      })
      .catch(error => {
        console.error("Error processing database query:", error);
        setProcessingVoice(false);

        // Show failure message
        setErrorMessage('Database query failed. Please try again.');

        // Clear error message after 5 seconds
        setTimeout(() => {
          setErrorMessage('');
        }, 5000);
      });
  };
  const navigateToDatabase = async (dbId) => {
    try {
      // Save dbId to localStorage
      localStorage.setItem('dbId', dbId);
      console.log('Selected DB ID:', dbId);

      // Fetch database info from the backend
  const response = await fetch(`${API_BASE_URL}/api/database/db-info/${dbId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch database information');
      }

      const dbInfo = await response.json();
      console.log('Database Info:', dbInfo);

      // Navigate to the database page with the database info
      navigate(`/database/${dbId}`, { state: { dbInfo } });
    } catch (error) {
      console.error('Error navigating to database:', error);
    }
  };
  const [activeDbId, setActiveDbId] = useState(null);
  const handleVoiceInput = (dbId) => {
    setActiveDbId(dbId);
    setShowVoiceModal(true);
  };

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gray-900 text-white">
      <Navbar />

      <div className="flex-grow relative">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20 animate-subtle-motion"
          style={{
            backgroundImage: "url('/db-bg.png')",
            animation: "subtleFloat 15s ease-in-out infinite alternate"
          }}
        />

        <div className="container mx-auto px-4 py-6 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{translations.title}</h1>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleConnectDatabase}
                className="px-4 py-2 rounded-lg font-medium shadow-lg transition-all duration-200 bg-green-600 hover:bg-green-700 hover:shadow-green-500/30 text-white hover:shadow-xl hover:scale-105"
              >
                {translations.connectButton}
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent border-b-transparent border-l-gray-300 border-r-gray-300"></div>
                <p className="mt-4 text-lg">Loading databases...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center rounded-xl shadow-lg bg-gray-800">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-lg">{error}</p>
              </div>
              <button
                onClick={fetchDatabases}
                className="px-6 py-2 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
              >
                Retry
              </button>
            </div>
          ) : databases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {databases.map((db) => (
                <div
                  key={db.id}
                  className="group relative rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-gray-600 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6 border-b border-gray-700">
                    <div className="flex items-start justify-between mb-0">
                      <div className="flex items-center space-x-3 min-w-0 flex-1"> {/* Added min-w-0 flex-1 and proper spacing */}
                        <div className="flex-shrink-0">
                          {dbTypeIconMap[db.type] ? (
                            <div className="w-10 h-10"> {/* Fixed: w-25 h-25 are not valid Tailwind classes */}
                              {dbTypeIconMap[db.type]}
                            </div>
                          ) : (
                            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0 flex-1 group relative"> {/* Added group for hover effects */}
                          <h3 className="font-semibold text-lg truncate cursor-default">
                            {db.name}
                          </h3>
                          {/* Custom tooltip that appears on hover */}
                          <div className="absolute left-0 top-full mt-1 px-2 py-1 bg-black text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 whitespace-nowrap">
                            {db.name}
                          </div>
                          <p className="text-sm text-gray-400">
                            {db.type || 'Database'}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4"> {/* Added proper margin */}
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${db.accessLevel === 'read-only'
                            ? 'bg-yellow-800 text-yellow-200'
                            : 'bg-green-800 text-green-200'
                          }`}>
                          {db.accessLevel === 'read-only' ? translations.readOnly : translations.readWrite}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Card Body */}
                  <div className="p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-300">
                          {translations.lastAccessed}
                        </span>
                        <span className="text-sm text-gray-400">
                          {new Date(db.lastAccessed).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-300">
                          {translations.preview}
                        </span>
                        <DbPreviewOption
                          dbId={db.id}
                          dbName={db.name}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Footer - Action Buttons */}
                  <div className="p-4 border-t border-gray-700 bg-gray-750">
                    <div className="flex items-center justify-between space-x-3">
                      {/* Voice Query Button */}
                      <div className="relative group/tooltip">
                        <button
                          onClick={() => handleVoiceInput(db.id)}
                          className="flex-1 p-2 rounded-lg transition-all duration-200 bg-purple-600 hover:bg-purple-700 hover:shadow-purple-500/30 text-white hover:shadow-lg flex items-center justify-center space-x-2"
                          title={translations.voiceQueryDb}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                          </svg>
                          <span className="text-sm font-medium">Voice</span>
                        </button>

                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 bg-gray-700 text-white">
                          Query by voice
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-700"></div>
                        </div>
                      </div>

                      {/* Navigate Button */}
                      <div className="relative group/tooltip">
                        <button
                          onClick={() => navigateToDatabase(db.id)}
                          className="flex-1 p-2 rounded-lg transition-all duration-200 bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/30 text-white hover:shadow-lg flex items-center justify-center space-x-2"
                          title={translations.queryDatabase}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          <span className="text-sm font-medium">Query</span>
                        </button>

                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded whitespace-nowrap opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-200 bg-gray-700 text-white">
                          Use to query
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-700"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl shadow-lg bg-gray-800">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center bg-gray-700">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Databases Found</h3>
              <p className="text-lg text-gray-400">
                {translations.noData}
              </p>
            </div>
          )}
        </div>
      </div>

      {processingVoice && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader />
        </div>
      )}

      {showConnectModal && (
        <ConnectDatabaseModal
          onClose={() => {
            setShowConnectModal(false);
            handleModalClose();
          }}
        />
      )}

      {showVoiceModal && (
        <VoiceSearchModal
          open={showVoiceModal}
          onClose={() => setShowVoiceModal(false)}
          onQuery={(transcript) => {
            setShowVoiceModal(false);
            handleDbVoiceQuery(activeDbId, transcript);
          }}
        />
      )}

      <footer className="mt-auto py-4 text-center backdrop-blur-sm bg-black/30">
        <p className="text-sm">©️ 2025 Data Visualization Platform</p>
      </footer>
    </div>
  );
};

export default DatabaseDashboard;