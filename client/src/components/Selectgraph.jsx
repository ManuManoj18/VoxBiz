import React, { useState, useEffect } from 'react';
import GraphSelector from './GraphSelector';
import Navbar from './Navbar';
import { useLocation } from 'react-router-dom';

function Selectg() {
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [dataToAnalyze, setDataToAnalyze] = useState([]);
  const [fullData, setFullData] = useState([]);
  const location = useLocation();
  
  useEffect(() => {
    const data = location.state?.visualizationData || [];
    
    // Store the full dataset
    setFullData(data);
    
    // Take only the first 3 items from the data array for analysis
    const limitedData = data.slice(0, 3);
    setDataToAnalyze(limitedData);
  }, [location]);
  
  const handleSelectGraph = (graphType) => {
    setSelectedGraph(graphType);
    console.log(`Selected graph type: ${graphType}`);
  };
  
  return (
    <div className="App p-2 min-h-screen w-screen transition-colors duration-300 bg-gray-900 text-white">
      <Navbar />
      <GraphSelector 
        data={dataToAnalyze} 
        fullData={fullData} 
        onSelectGraph={handleSelectGraph} 
      />
      {selectedGraph && (
        <div className="mt-6 p-2 border rounded border-gray-400 text-center">
          <h2 className="text-lg font-bold">Selected Graph: {selectedGraph}</h2>
          <p>Here you would render the actual <strong>{selectedGraph}</strong> graph.</p>
        </div>
      )}
    </div>
  );
}

export default Selectg;