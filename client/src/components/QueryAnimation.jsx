import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaChartBar, FaLanguage, FaRobot, FaDatabase, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ThreeDMarquee from './ui/3DMarquee';


function QuerySection() {
    const [currentQueryIndex, setCurrentQueryIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [voiceInput, setVoiceInput] = useState("");
    const [showQuery, setShowQuery] = useState(false);
    const [queryComplete, setQueryComplete] = useState(false);
    const [showVisualization, setShowVisualization] = useState(false);
  
    const queryData = [
      {
        voiceInput: "Show me all Kannada speech with high confidence",
        query: "SELECT * FROM speech WHERE language='Kannada' AND confidence > 0.8",
        color: "from-blue-400 to-cyan-500",
        visualization: "table",
        data: [
          { id: 1, text: "ಹಲೋ ಹೇಗಿದ್ದೀರಿ", confidence: 0.94, speaker: "User_001" },
          { id: 2, text: "ಇಂದು ಹವಾಮಾನ ಚೆನ್ನಾಗಿದೆ", confidence: 0.89, speaker: "User_002" },
          { id: 3, text: "ನಾನು ಕೆಲಸಕ್ಕೆ ಹೋಗುತ್ತಿದ್ದೇನೆ", confidence: 0.92, speaker: "User_003" }
        ]
      },
      {
        voiceInput: "Analyze sentiment by speaker sorted by positivity",
        query: "ANALYZE sentiment GROUP BY speaker ORDER BY positivity DESC",
        color: "from-green-400 to-emerald-500",
        visualization: "bar",
        data: [
          { speaker: "Alice", positive: 85, neutral: 12, negative: 3 },
          { speaker: "Bob", positive: 72, neutral: 20, negative: 8 },
          { speaker: "Carol", positive: 68, neutral: 25, negative: 7 },
          { speaker: "David", positive: 55, neutral: 30, negative: 15 }
        ]
      },
      {
        voiceInput: "Show word frequency across all languages, limit fifteen",
        query: "VISUALIZE word_frequency ACROSS languages LIMIT 15",
        color: "from-purple-400 to-pink-500",
        visualization: "pie",
        data: [
          { word: "Hello", count: 245, language: "EN" },
          { word: "ನಮಸ್ಕಾರ", count: 189, language: "KN" },
          { word: "வணக்கம்", count: 156, language: "TA" },
          { word: "నమస్కారం", count: 134, language: "TE" },
          { word: "नमस्ते", count: 198, language: "HI" }
        ]
      },
      {
        voiceInput: "Find all conversations longer than five minutes",
        query: "SELECT * FROM conversations WHERE duration > 300 AND status='completed'",
        color: "from-orange-400 to-red-500",
        visualization: "line",
        data: [
          { time: "00:00", duration: 420 },
          { time: "02:00", duration: 380 },
          { time: "04:00", duration: 520 },
          { time: "06:00", duration: 340 },
          { time: "08:00", duration: 610 }
        ]
      },
      {
        voiceInput: "Get top speakers by total speaking time this month",
        query: "SELECT speaker_id, SUM(duration) FROM sessions WHERE date >= CURRENT_MONTH GROUP BY speaker_id ORDER BY total_time DESC",
        color: "from-teal-400 to-blue-500",
        visualization: "bar",
        data: [
          { speaker: "Speaker_001", minutes: 1250 },
          { speaker: "Speaker_002", minutes: 980 },
          { speaker: "Speaker_003", minutes: 875 },
          { speaker: "Speaker_004", minutes: 720 }
        ]
      },
      {
        voiceInput: "Show me accuracy trends for Telugu language processing",
        query: "SELECT DATE(timestamp), AVG(accuracy) FROM processing_logs WHERE language='Telugu' GROUP BY DATE(timestamp) ORDER BY date DESC",
        color: "from-rose-400 to-pink-500",
        visualization: "line",
        data: [
          { date: "Jan 1", accuracy: 85 },
          { date: "Jan 15", accuracy: 88 },
          { date: "Feb 1", accuracy: 91 },
          { date: "Feb 15", accuracy: 89 },
          { date: "Mar 1", accuracy: 94 }
        ]
      }
    ];
  
    const languages = ["English", "हिंदी", "ಕನ್ನಡ", "বাংলা", "தமிழ்", "తెలుగు"];
  
    useEffect(() => {
      const runQueryAnimation = async () => {
        // Reset states
        setIsListening(false);
        setVoiceInput("");
        setShowQuery(false);
        setQueryComplete(false);
        setShowVisualization(false);
  
        // Wait a bit before starting
        await new Promise(resolve => setTimeout(resolve, 1000));
  
        // Start listening animation
        setIsListening(true);
        await new Promise(resolve => setTimeout(resolve, 500));
  
        // Simulate voice input typing
        const currentData = queryData[currentQueryIndex];
        let inputText = "";
        for (let i = 0; i <= currentData.voiceInput.length; i++) {
          inputText = currentData.voiceInput.slice(0, i);
          setVoiceInput(inputText);
          await new Promise(resolve => setTimeout(resolve, 50));
        }
  
        // Stop listening and show processing
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsListening(false);
        
        // Wait for processing animation
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Show query
        setShowQuery(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mark as complete
        setQueryComplete(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show visualization
        setShowVisualization(true);
        
        // Wait before next query
        await new Promise(resolve => setTimeout(resolve, 4000));
        
        // Move to next query
        setCurrentQueryIndex((prev) => (prev + 1) % queryData.length);
      };
  
      runQueryAnimation();
    }, [currentQueryIndex]);
  
    const renderVisualization = (data, type, color) => {
      switch (type) {
        case "table":
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 rounded-xl overflow-hidden border border-white/10"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-white">
                  <thead className={`bg-gradient-to-r ${color}`}>
                    <tr>
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Text</th>
                      <th className="px-4 py-3 text-left">Confidence</th>
                      <th className="px-4 py-3 text-left">Speaker</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-700"
                      >
                        <td className="px-4 py-3">{row.id}</td>
                        <td className="px-4 py-3 font-mono text-sm">{row.text}</td>
                        <td className="px-4 py-3">{row.confidence}</td>
                        <td className="px-4 py-3">{row.speaker}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          );
  
        case "bar":
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 rounded-xl p-6 border border-white/10"
            >
              <div className="space-y-4">
                {data.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ delay: index * 0.2, duration: 0.8 }}
                    className="flex items-center gap-4"
                  >
                    <span className="text-white font-medium w-20">{item.speaker || item.word}</span>
                    <div className="flex-1 bg-gray-700 rounded-full h-8 relative overflow-hidden">
                      <motion.div
                        initial={{ width: "0%" }}
                        animate={{ width: `${((item.positive || item.minutes || item.count) / Math.max(...data.map(d => d.positive || d.minutes || d.count))) * 100}%` }}
                        transition={{ delay: index * 0.2 + 0.3, duration: 1 }}
                        className={`h-full bg-gradient-to-r ${color} rounded-full flex items-center justify-end pr-3`}
                      >
                        <span className="text-white font-semibold text-sm">
                          {item.positive || item.minutes || item.count}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
  
        case "pie":
          return (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/40 rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                    {data.map((item, index) => {
                      const total = data.reduce((sum, d) => sum + d.count, 0);
                      const percentage = (item.count / total) * 100;
                      const angle = (percentage / 100) * 360;
                      const startAngle = data.slice(0, index).reduce((sum, d) => sum + (d.count / total) * 360, 0);
                      
                      return (
                        <motion.path
                          key={index}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: index * 0.2, duration: 1 }}
                          d={`M 100 100 L ${100 + 80 * Math.cos((startAngle - 90) * Math.PI / 180)} ${100 + 80 * Math.sin((startAngle - 90) * Math.PI / 180)} A 80 80 0 ${angle > 180 ? 1 : 0} 1 ${100 + 80 * Math.cos((startAngle + angle - 90) * Math.PI / 180)} ${100 + 80 * Math.sin((startAngle + angle - 90) * Math.PI / 180)} Z`}
                          fill={`hsl(${200 + index * 60}, 70%, 60%)`}
                          stroke="rgba(255,255,255,0.1)"
                          strokeWidth="1"
                        />
                      );
                    })}
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-white font-bold text-lg">Total</div>
                      <div className="text-gray-300">{data.reduce((sum, d) => sum + d.count, 0)}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-2">
                {data.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: `hsl(${200 + index * 60}, 70%, 60%)` }}
                    ></div>
                    <span className="text-white text-sm">{item.word} ({item.count})</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
  
        case "line":
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/40 rounded-xl p-6 border border-white/10"
            >
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 400 200">
                  <defs>
                    <linearGradient id={`gradient-${currentQueryIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgb(59, 130, 246)" />
                      <stop offset="100%" stopColor="rgb(147, 51, 234)" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid lines */}
                  {[...Array(5)].map((_, i) => (
                    <line
                      key={i}
                      x1="50"
                      y1={40 + i * 30}
                      x2="350"
                      y2={40 + i * 30}
                      stroke="rgba(255,255,255,0.1)"
                      strokeWidth="1"
                    />
                  ))}
                  
                  {/* Data line */}
                  <motion.polyline
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2 }}
                    fill="none"
                    stroke={`url(#gradient-${currentQueryIndex})`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    points={data.map((point, index) => 
                      `${50 + (index * 75)},${170 - (point.duration || point.accuracy) * 1.2}`
                    ).join(' ')}
                  />
                  
                  {/* Data points */}
                  {data.map((point, index) => (
                    <motion.circle
                      key={index}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.3, duration: 0.5 }}
                      cx={50 + (index * 75)}
                      cy={170 - (point.duration || point.accuracy) * 1.2}
                      r="4"
                      fill="white"
                      stroke={`url(#gradient-${currentQueryIndex})`}
                      strokeWidth="2"
                    />
                  ))}
                </svg>
                
                {/* Labels */}
                <div className="absolute bottom-0 left-0 right-0 flex justify-between text-gray-400 text-sm px-12">
                  {data.map((point, index) => (
                    <span key={index}>{point.time || point.date}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
  
        default:
          return null;
      }
    };
  
    const currentData = queryData[currentQueryIndex];
  
    return (
      <div className="py-20 bg-black relative overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
  
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-medium">Live Demo</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Voice-to-Query in
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
                Real Action
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Watch how natural language transforms into powerful database queries with instant visualizations
            </p>
            
            {/* Language Demo Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {languages.map((lang, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentQueryIndex(Math.floor(Math.random() * queryData.length))}
                  className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 hover:from-blue-500/20 hover:to-purple-500/20 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium transition-all duration-300 border border-gray-600 hover:border-blue-400"
                >
                  Try {lang}
                </motion.button>
              ))}
            </div>
          </motion.div>
          
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Voice Input Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-6">
                {/* Voice Icon */}
                <motion.div
                  animate={{
                    scale: isListening ? [1, 1.2, 1] : 1,
                    rotate: isListening ? [0, 5, -5, 0] : 0
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: isListening ? Infinity : 0,
                    ease: "easeInOut"
                  }}
                  className={`p-6 rounded-2xl ${
                    isListening 
                      ? `bg-gradient-to-br ${currentData.color} shadow-2xl` 
                      : 'bg-gray-700/50'
                  } relative`}
                >
                  <FaMicrophone className={`w-8 h-8 ${isListening ? 'text-white' : 'text-gray-400'}`} />
                  {isListening && (
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentData.color} rounded-2xl blur-xl opacity-50 -z-10 animate-pulse`}></div>
                  )}
                </motion.div>
  
                {/* Voice Input Display */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-sm font-medium text-gray-400">
                      {isListening ? 'Listening...' : voiceInput ? 'Processing...' : 'Ready'}
                    </span>
                    {isListening && (
                      <div className="flex gap-1">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{
                              duration: 0.6,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                            className={`w-2 h-2 bg-gradient-to-r ${currentData.color} rounded-full`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="bg-black/30 rounded-xl p-4 border border-white/5">
                    <span className="text-white text-lg font-mono">
                      {voiceInput}
                      {isListening && (
                        <motion.span
                          animate={{ opacity: [1, 0] }}
                          transition={{ duration: 0.8, repeat: Infinity }}
                          className="ml-1"
                        >
                          |
                        </motion.span>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
  
            {/* Query Output Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: showQuery ? 1 : 0.3 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${currentData.color}`}>
                  <FaDatabase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Generated SQL Query</h3>
                  <p className="text-gray-400 text-sm">Optimized for your database</p>
                </div>
                {queryComplete && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto"
                  >
                    <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-green-400 text-sm font-medium">Executed</span>
                    </div>
                  </motion.div>
                )}
              </div>
              
              <div className="bg-black/40 rounded-xl p-6 border border-white/5 font-mono relative overflow-hidden">
                {showQuery ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-start">
                      <span className="text-green-400 mr-3 flex-shrink-0">{'>'}</span>
                      <motion.span
                        initial={{ width: 0 }}
                        animate={{ width: "auto" }}
                        className="text-green-300 text-lg leading-relaxed"
                      >
                        {currentData.query}
                      </motion.span>
                    </div>
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: showQuery ? "100%" : "0%" }}
                      transition={{ duration: 1.5, delay: 0.3 }}
                      className={`mt-4 h-1 bg-gradient-to-r ${currentData.color} rounded-full`}
                    />
                  </motion.div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Processing query...</span>
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            delay: i * 0.3
                          }}
                          className="w-2 h-2 bg-gray-500 rounded-full"
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
  
            {/* Visualization Results */}
            {showVisualization && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${currentData.color}`}>
                    <FaChartBar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">Query Results</h3>
                    <p className="text-gray-400 text-sm">Interactive data visualization</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 bg-blue-500/20 px-3 py-1 rounded-full">
                    <FaEye className="w-3 h-3 text-blue-400" />
                    <span className="text-blue-400 text-sm font-medium">Live Data</span>
                  </div>
                </div>
                
                {renderVisualization(currentData.data, currentData.visualization, currentData.color)}
              </motion.div>
            )}
  
            {/* Query Progress Indicators */}
            <div className="flex justify-center gap-2">
              {queryData.map((_, index) => (
                <motion.div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentQueryIndex
                      ? `w-8 bg-gradient-to-r ${currentData.color}`
                      : index < currentQueryIndex
                      ? 'w-2 bg-green-400/50'
                      : 'w-2 bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  export default QuerySection;