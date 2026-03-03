import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
// import { PreviewOption } from '../components/ui/link-preview';
import { useLocation , useNavigate } from 'react-router-dom';

function VisualizationChoicePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { queryResponse } = location.state || {};
    console.log("Query Response:", queryResponse);
    if (queryResponse) {
      setData(queryResponse);
    }
  }, [location.state]);

  // Navigate to table view with data
  const navigateToTableView = () => {
    navigate("/table", { state: { visualizationData: data } });
  };

  // Navigate to graph view with data
  const navigateToGraphView = () => {
    navigate("/selectgraph", { state: { visualizationData: data } });
  };

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-900 text-white"
         style={{
           backgroundImage: `url('/choice-bg.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundRepeat: 'no-repeat'
         }}>
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-12 backdrop-blur-sm py-2 rounded">
          Choose Visualization Type
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6 max-w-4xl mx-auto">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Table Visualization Card */}
          <div className="backdrop-blur-sm bg-gray-800/80 rounded-xl shadow-lg p-6 flex flex-col hover:shadow-xl transition-all">
            <h2 className="text-2xl font-bold mb-3">Table View</h2>
            <p className="text-gray-300 mb-6">Structured rows and columns for detailed data analysis</p>
            
            <div className="flex-grow flex items-center justify-center mb-6">
              <PreviewOption title="Table Preview" imageSrc="/table-preview.png" />
            </div>
            
            <button 
              className={`w-full py-2 px-4 rounded-lg transition-colors ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              onClick={navigateToTableView}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Select'}
            </button>
          </div>

          {/* Graph Visualization Card */}
          <div className="backdrop-blur-sm bg-gray-800/80 rounded-xl shadow-lg p-6 flex flex-col hover:shadow-xl transition-all">
            <h2 className="text-2xl font-bold mb-3">Graph View</h2>
            <p className="text-gray-300 mb-6">Visual representation of data relationships and trends with comparative insights</p>
            
            <div className="flex-grow flex items-center justify-center mb-6">
              <PreviewOption title="Graph Preview" imageSrc="/graph-preview.png" />
            </div>
            
            <button 
              className={`w-full py-2 px-4 rounded-lg transition-colors ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              onClick={navigateToGraphView}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Select'}
            </button>
          </div>
        </div>
      </main>
      
      <footer className="mt-auto py-4 text-center backdrop-blur-sm bg-black/30">
        <p className="text-sm">© 2025 Data Visualization Platform</p>
      </footer>
    </div>
  );
};

export default VisualizationChoicePage;
