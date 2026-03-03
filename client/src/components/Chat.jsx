import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from "react-markdown";
import { API_BASE_URL } from '../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ChatBox = ({ onClose, theme = 'light' }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [visualizationData, setVisualizationData] = useState(null);
  const [visualizationType, setVisualizationType] = useState("table");
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const isDark = theme === 'dark';

  const SYSTEM_PROMPT = `You are a business intelligence assistant with access to the user's database. Your role is to help users visualize and understand their business data.

You must:
✔ Respond to queries about business metrics, sales data, inventory, and other database information
✔ Recommend appropriate visualizations based on the data retrieved
✔ Explain insights from the data in simple, non-technical language
✔ Assist with modifying visualizations based on user feedback
✔ Reference what's currently on the user's screen when relevant


When making recommendations, consider:
- Bar charts for comparing categories
- Line charts for time series data
- Pie charts for showing proportions
- Tables for detailed data views

If you don't understand a query or need more information, ask clarifying questions.`;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setTimeout(() => {
          sendMessage(transcript);
        }, 500);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [messages]); // Dependency on messages to get the latest state when sending

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error("Error starting speech recognition:", error);
      }
    }
  };

  const sendMessage = async (messageText = null) => {
    const messageToSend = messageText || input.trim();
    if (!messageToSend || loading) return;
  
    const userMessage = messageToSend;
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
  
    // Capture screenshot if supported (using html2canvas or similar library)
    let screenshot = null;
    try {
      if (window.html2canvas) {
        const canvas = await html2canvas(document.querySelector('#main-content-area')); // Target your main content area
        screenshot = canvas.toDataURL('image/jpeg', 0.7); // Compress as JPEG with 70% quality
      }
    } catch (error) {
      console.error("Error capturing screenshot:", error);
    }
  
    try {
  const response = await axios.post(`${API_BASE_URL}/api/business-chat`, {
        message: userMessage,
        systemPrompt: SYSTEM_PROMPT,
        currentVisualization: visualizationType,
        screenshot: screenshot
      });

      const { botResponse, data, recommendedVisualization } = response.data;
      
      if (botResponse) {
        setMessages([...newMessages, { role: "assistant", content: botResponse }]);
        
        if (data) {
          setVisualizationData(data);
          if (recommendedVisualization) {
            setVisualizationType(recommendedVisualization);
          }
        }
      } else {
        throw new Error("Empty response from AI");
      }
    } catch (error) {
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });

      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.details ||
                          "I apologize, but I'm having trouble processing your question. Please try again.";

      setMessages([...newMessages, { 
        role: "assistant", 
        content: `⚠️ ${errorMessage}` 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const changeVisualization = (type) => {
    setVisualizationType(type);
  };

  const renderVisualization = () => {
    if (!visualizationData) return null;
    
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
    
    switch (visualizationType) {
      case 'bar':
        return (
          <div className={`p-4 ${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow mb-4`}>
            <h3 className="text-lg font-semibold mb-2">Bar Chart Visualization</h3>
            <BarChart width={450} height={300} data={visualizationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke={isDark ? "#fff" : "#666"} />
              <YAxis stroke={isDark ? "#fff" : "#666"} />
              <Tooltip contentStyle={isDark ? { backgroundColor: '#333', color: '#fff', border: '1px solid #555' } : {}} />
              <Legend />
              {Object.keys(visualizationData[0]).filter(key => key !== 'name').map((key, index) => (
                <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
              ))}
            </BarChart>
          </div>
        );
        
      case 'line':
        return (
          <div className={`p-4 ${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow mb-4`}>
            <h3 className="text-lg font-semibold mb-2">Line Chart Visualization</h3>
            <LineChart width={450} height={300} data={visualizationData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#555" : "#ccc"} />
              <XAxis dataKey="name" stroke={isDark ? "#fff" : "#666"} />
              <YAxis stroke={isDark ? "#fff" : "#666"} />
              <Tooltip contentStyle={isDark ? { backgroundColor: '#333', color: '#fff', border: '1px solid #555' } : {}} />
              <Legend />
              {Object.keys(visualizationData[0]).filter(key => key !== 'name').map((key, index) => (
                <Line key={key} type="monotone" dataKey={key} stroke={COLORS[index % COLORS.length]} />
              ))}
            </LineChart>
          </div>
        );
        
      case 'pie':
        return (
          <div className={`p-4 ${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow mb-4`}>
            <h3 className="text-lg font-semibold mb-2">Pie Chart Visualization</h3>
            <PieChart width={450} height={300}>
              <Pie
                data={visualizationData}
                dataKey={Object.keys(visualizationData[0])[1]}
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={{fill: isDark ? '#fff' : '#333'}}
              >
                {visualizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={isDark ? { backgroundColor: '#333', color: '#fff', border: '1px solid #555' } : {}} />
              <Legend />
            </PieChart>
          </div>
        );
        
      case 'table':
      default:
        return (
          <div className={`p-4 ${isDark ? 'bg-gray-800 text-white' : 'bg-white'} rounded-lg shadow mb-4 overflow-x-auto`}>
            <h3 className="text-lg font-semibold mb-2">Data Table</h3>
            <table className={`min-w-full border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <thead>
                <tr className={isDark ? 'bg-gray-700' : 'bg-gray-100'}>
                  {Object.keys(visualizationData[0]).map(key => (
                    <th key={key} className={`px-4 py-2 border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visualizationData.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 
                    ? (isDark ? 'bg-gray-800' : 'bg-white') 
                    : (isDark ? 'bg-gray-700' : 'bg-gray-50')}>
                    {Object.values(row).map((value, colIndex) => (
                      <td key={colIndex} className={`px-4 py-2 border ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    }
  };

  return (
    <div 
      className={`fixed top-1/2 transform -translate-y-1/2 w-[520px] ${isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'} shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-300'} rounded-lg`}
      style={{ zIndex: 9999 }} // Add high z-index to ensure it displays on top
    >
      <div className="p-4 bg-[#14072d] text-white flex justify-between rounded-t-lg">
        <span className="font-bold">Business Intelligence Assistant</span>
        <button 
          onClick={onClose}
          className="hover:bg-neutral-700 rounded-full w-6 h-6 flex items-center justify-center"
        >
          X
        </button>
      </div>

      {visualizationData && (
        <div className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {renderVisualization()}
          <div className="p-2 flex justify-center space-x-2 mb-2">
            <button 
              onClick={() => changeVisualization('table')} 
              className={`px-3 py-1 rounded ${visualizationType === 'table' 
                ? 'bg-blue-600 text-white' 
                : (isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black')}`}
            >
              Table
            </button>
            <button 
              onClick={() => changeVisualization('bar')} 
              className={`px-3 py-1 rounded ${visualizationType === 'bar' 
                ? 'bg-blue-600 text-white' 
                : (isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black')}`}
            >
              Bar
            </button>
            <button 
              onClick={() => changeVisualization('line')} 
              className={`px-3 py-1 rounded ${visualizationType === 'line' 
                ? 'bg-blue-600 text-white' 
                : (isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black')}`}
            >
              Line
            </button>
            <button 
              onClick={() => changeVisualization('pie')} 
              className={`px-3 py-1 rounded ${visualizationType === 'pie' 
                ? 'bg-blue-600 text-white' 
                : (isDark ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black')}`}
            >
              Pie
            </button>
          </div>
        </div>
      )}

      <div className="h-64 overflow-y-auto p-4">
        {messages.length === 0 && (
          <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-center p-4`}>
            Welcome! I'm your business intelligence assistant. Ask me about your business data using text or voice commands, and I'll help you visualize and understand it.
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 p-2 rounded-lg ${
              msg.role === "user" 
                ? "bg-blue-500 text-white text-right ml-auto" 
                : (isDark ? "bg-gray-700 text-white" : "bg-gray-200 text-black")
            }`}
          >
            <div className="whitespace-pre-wrap break-words">
              <ReactMarkdown>{msg.content}</ReactMarkdown>
            </div>
          </div>
        ))}
        {loading && (
          <div className={`flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="animate-bounce">●</div>
            <div className="animate-bounce [animation-delay:0.2s]">●</div>
            <div className="animate-bounce [animation-delay:0.4s]">●</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 flex">
        <input
          type="text"
          className={`flex-1 p-2 border rounded-lg ${
            isDark 
              ? 'bg-gray-800 border-gray-700 text-white' 
              : 'bg-white border-gray-300 text-black'
          }`}
          placeholder="Ask about your business data..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading || isListening}
        />
        <button
          onClick={toggleListening}
          className={`ml-2 ${isListening ? 'bg-red-600' : 'bg-blue-600'} hover:bg-blue-800 text-white px-3 py-2 rounded-lg`}
          title={isListening ? "Stop listening" : "Start voice input"}
        >
          🎤
        </button>
        <button
          onClick={() => sendMessage()}
          className="ml-2 bg-[#14072d] hover:bg-blue-800 text-white px-4 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading || !input.trim() || isListening}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;