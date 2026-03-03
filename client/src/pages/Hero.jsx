import React, { useState, useEffect, useRef } from 'react';

import Navbar from '../components/Navbar';
import { ThreeDMarquee } from '../components/ui/3DMarquee';
import { motion } from 'framer-motion';
import { FaMicrophone, FaChartBar, FaLanguage, FaRobot, FaDatabase, FaEye, FaChevronLeft, FaChevronRight , FaPlay } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../lib/api';

// import CTASection from '../components/CTASection';
// import QuerySection from '../components/QueryAnimation';
// import HeroSection from '../components/Hero';
// import FeaturesSection from '../components/Features';
// import Footer from '../components/Footer';




function HeroSection() {
    const navigate = useNavigate();             
  const features = ["AI-powered", "Collaborative", "Real-time", "Multilingual", "Intuitive"];
  const [currentFeature, setCurrentFeature] = useState(0);

  const images = [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcZmTeq0HUkRzFVFLec8ZtDD5sKWu53YQTfA&s",
      "https://images.squarespace-cdn.com/content/v1/55b6a6dce4b089e11621d3ed/1438044607549-3JN33PGPNPAHNW46B8XH/image-asset.gif",
      "https://thumbs.dreamstime.com/b/data-visualization-graphs-beautiful-illustration-picture-generative-ai-data-visualization-graphs-beautiful-illustration-277721327.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOcHGm259_gokvC5kmNjcku8Py0zO7JbOmpg&s",
      "https://blogs.sas.com/content/sastraining/files/2014/09/big_bang_theory.png",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQz4hYL54pQZJSCgksKYzzPWBzGZdFSsipih2QDhyeHwXMOdYDJkcKR14nLy1u0QrAyWHw&usqp=CAU",
      "https://blogs.sas.com/content/graphicallyspeaking/files/2019/11/mortgage5b.png",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLrViFM9X5J5KrbEgP1dkqSGYBT9LAVhBHapa5wkzol3ntWQwXVUUCPLJ40L_UJSifJwE&usqp=CAU",
      "https://png.pngtree.com/background/20210715/original/pngtree-beautiful-digital-data-transfer-through-dotted-lines-with-nubers-in-black-picture-image_1257401.jpg",
      "https://img.freepik.com/premium-vector/statistic-data-analysis-visualization-background_115973-29.jpg",
      "https://img.freepik.com/premium-vector/data-visualization-background_23-2151946700.jpg?w=360",
      "https://img.freepik.com/premium-vector/data-visualization-background_23-2151946695.jpg",
      "https://img.freepik.com/premium-photo/abstract-data-visualization-with-charts_1333858-317.jpg",
      "https://img.freepik.com/premium-photo/abstract-business-data-visualization-with-line-bar-graphs_717577-13264.jpg",
      "https://miro.medium.com/v2/resize:fit:3120/1*6XAf0oi88MRCBbCd_cHcew.png",
      "https://www.boldbi.com/wp-content/uploads/2019/07/data-visualization-importance-featured.webp",
      "https://media.licdn.com/dms/image/v2/D5612AQEdkUVbcAAEIQ/article-cover_image-shrink_600_2000/article-cover_image-shrink_600_2000/0/1683373256101?e=2147483647&v=beta&t=piVzGuo-TLgPRwJRAozHmNJvfG9Gm5ywxYZ8AN9bU2k",
      "https://www.shutterstock.com/image-photo/3d-statistics-isolated-white-background-600nw-2469272241.jpg",
      "https://c8.alamy.com/comp/2G3W9KH/analytics-low-poly-design-statistical-data-analysis-profit-diagram-polygonal-vector-illustrations-on-a-blue-background-2G3W9KH.jpg",
      "https://assets.everspringpartners.com/dims4/default/e63ffb2/2147483647/strip/true/crop/1518x612+0+0/resize/800x323!/quality/90/?url=http%3A%2F%2Feverspring-brightspot.s3.us-east-1.amazonaws.com%2Fb0%2F7e%2F74ed21084c41b6e6f15de2d6444d%2Fmsfa-dataanalysis-vis-techniques.jpg",
      "https://t4.ftcdn.net/jpg/09/95/03/13/360_F_995031304_hxJxdBwdua8ufqR8d4yDIJsuybNWA07k.jpg",
      "https://t3.ftcdn.net/jpg/09/86/31/74/360_F_986317407_1vi6a2XYYpRza5edEsetBQi8nF8T3kXV.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQE6QU9VnwyT0u99MOCLMpbeFvxzba1gzYAapESMXHI0CZD-y3ymoWZZ7a7qPsrdKWS9Y0&usqp=CAU",
      "https://media.istockphoto.com/id/850583632/vector/data-pattern-background.jpg?b=1&s=612x612&w=0&k=20&c=UeW_VLc-u4WpxHpfxTUOI1MillEIY622u8Y-YDCfM6k=",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9WR3ImlYhla_O2p0W4wSoYJn-hNTQFMmV7g&s",
      "https://www.shutterstock.com/shutterstock/photos/2258134001/display_1500/stock-photo-relational-database-tables-on-databases-are-placed-on-structured-query-language-code-with-server-2258134001.jpg",
      "https://png.pngtree.com/thumb_back/fh260/background/20230611/pngtree-sql-development-language-as-a-coding-concept-sql-photo-image_3043068.jpg",
      "https://static.vecteezy.com/system/resources/thumbnails/008/300/431/small_2x/sql-or-structured-query-language-code-on-computer-monitor-and-server-room-background-example-of-sql-code-to-query-data-from-a-database-photo.jpg",
      "https://www.shutterstock.com/image-photo/user-can-check-data-storage-260nw-2287992327.jpg",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROSvnsPKRmTn_SKx6jMZ7pvQIHT-IxQoC-vw&s",
      "https://assets.aceternity.com/world-map.webp",
    ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = async () => {
    try {
  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
  
      if (res.ok) {
        // ✅ User is authenticated
        navigate('/dblist');
      } else {
        // ❌ Not authenticated
        navigate('/login');
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      navigate('/login');
    }
  };

  const scrollToDemo = () => {
    document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* 3D Marquee Background */}
      <div className="absolute inset-0 z-0 h-full w-full bg-gradient-to-b from-black/80 via-black/85 to-black/90" />
      <ThreeDMarquee className="pointer-events-none absolute inset-0 h-full w-full z-0" images={images} />
  
      {/* Animated background elements */}
      <div className="absolute inset-0 z-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-20 text-center relative z-20">
          {/* VoxBiz Header */}
          <motion.div
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
  className="mb-8"
>
  <motion.h1 
    className="text-5xl md:text-6xl lg:text-7xl font-bold flex items-center justify-center whitespace-nowrap cursor-pointer transition-transform duration-200"
    whileHover={{ scale: 1.05 }}
    animate={{ 
      textShadow: [
        "0 0 20px rgba(139, 92, 246, 0.6)",
        "0 0 30px rgba(236, 72, 153, 0.8)",
        "0 0 25px rgba(139, 92, 246, 0.7)",
      ]
    }}
    transition={{ 
      textShadow: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }}
  >
    Vox
    <motion.span 
      className="bg-gradient-to-br from-violet-500 to-pink-500 text-transparent bg-clip-text"
      animate={{
        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "linear"
      }}
      style={{
        backgroundSize: "200% 200%"
      }}
    >
      Biz
    </motion.span>
  </motion.h1>
</motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Transform Speech into{" "}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-2xl">
                Visual Data
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </span>
          </h1>
        </motion.div>

        <motion.div 
  initial={{ opacity: 0 }} 
  animate={{ opacity: 1 }} 
  transition={{ duration: 0.8, delay: 0.3 }} 
  className="text-xl md:text-2xl text-white mb-4 drop-shadow-lg
             [text-shadow:0_0_20px_rgba(255,255,255,0.8)]
             hover:[text-shadow:0_0_25px_rgba(255,255,255,1)]
             transition-all duration-300"
>
  Your{" "}
  <motion.span
    key={currentFeature}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 font-semibold 
               drop-shadow-[0_0_25px_rgba(251,191,36,0.8)]
               [filter:drop-shadow(0_0_20px_rgba(249,115,22,0.9))]
               animate-pulse"
  >
    {features[currentFeature]}
  </motion.span>
  {" "}visualization platform
</motion.div>

        <motion.p
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.8, delay: 0.6 }}
  className="text-lg text-gray-200 max-w-3xl mx-auto mb-10 drop-shadow-lg
             hover:text-white hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]
             transition-all duration-300 ease-in-out
             [text-shadow:0_0_20px_rgba(255,255,255,0.3)]"
>
  Transform your data into actionable insights using voice-driven queries. 
  Experience real-time analytics and data visualization that empower you to 
  make smarter, data-informed decisions across multiple languages.
</motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-xl drop-shadow-lg"
          >
            Start Visualizing Now
          </button>
          <button
            onClick={scrollToDemo}
            className="px-8 py-4 border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white text-lg font-semibold rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-2 drop-shadow-lg"
          >
            <FaPlay className="text-sm" />
            Watch Demo
          </button>
        </motion.div>
      </div>
    </div>
  );
}

// Features Section Component
function FeaturesSection() {
    const [currentIndex, setCurrentIndex] = useState(0);
  
    const features = [
      {
        title: "Voice Recognition",
        icon: <FaMicrophone className="w-12 h-12" />,
        description: "Advanced AI-powered speech recognition supporting multiple languages with real-time processing and high accuracy rates.",
        color: "from-blue-500 to-cyan-500",
        accent: "text-blue-400",
        bgGradient: "from-blue-500/10 to-cyan-500/10"
      },
      {
        title: "Data Visualization", 
        icon: <FaChartBar className="w-12 h-12" />,
        description: "Transform complex datasets into beautiful, interactive charts and graphs that reveal insights at a glance.",
        color: "from-emerald-500 to-teal-500",
        accent: "text-emerald-400",
        bgGradient: "from-emerald-500/10 to-teal-500/10"
      },
      {
        title: "Multi-Language Support",
        icon: <FaLanguage className="w-12 h-12" />,
        description: "Native support for Hindi, Kannada, Tamil, Telugu, Malayalam, and English with seamless language switching.",
        color: "from-purple-500 to-pink-500", 
        accent: "text-purple-400",
        bgGradient: "from-purple-500/10 to-pink-500/10"
      },
      {
        title: "AI Intelligence",
        icon: <FaRobot className="w-12 h-12" />,
        description: "Powered by advanced machine learning algorithms that understand context and provide intelligent suggestions.",
        color: "from-orange-500 to-red-500",
        accent: "text-orange-400",
        bgGradient: "from-orange-500/10 to-red-500/10"
      },
      {
        title: "Database Integration",
        icon: <FaDatabase className="w-12 h-12" />,
        description: "Connect to multiple data sources and databases with secure, real-time data synchronization capabilities.",
        color: "from-yellow-500 to-amber-500",
        accent: "text-yellow-400",
        bgGradient: "from-yellow-500/10 to-amber-500/10"
      },
      {
        title: "Real-time Analytics",
        icon: <FaEye className="w-12 h-12" />,
        description: "Instant data processing and visualization with live updates as your data changes in real-time.",
        color: "from-rose-500 to-pink-500",
        accent: "text-rose-400",
        bgGradient: "from-rose-500/10 to-pink-500/10"
      },
    ];
  
    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % features.length);
      }, 4000);
      return () => clearInterval(interval);
    }, []);
  
    const nextFeature = () => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    };
  
    const prevFeature = () => {
      setCurrentIndex((prev) => (prev - 1 + features.length) % features.length);
    };
  
    return (
      <div className="min-h-screen bg-black relative overflow-hidden py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
  
        <div className="container mx-auto px-6 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10 mb-8">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 font-medium">Powerful Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Discover What Makes Us
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                Extraordinary
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience cutting-edge capabilities that transform how you interact with data
            </p>
          </motion.div>
  
          {/* Sliding Features Container */}
          <div className="relative max-w-6xl mx-auto">
            {/* Main Slider */}
            <div className="relative overflow-hidden rounded-3xl">
              <motion.div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`
                }}
              >
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 px-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                      className={`bg-gradient-to-br ${feature.bgGradient} backdrop-blur-xl p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden`}
                    >
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-5">
                        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${feature.color} rounded-full blur-3xl`}></div>
                      </div>
                      
                      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-12">
                        {/* Icon Section */}
                        <motion.div
                          initial={{ scale: 0.8, rotate: -10 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                          className="flex-shrink-0"
                        >
                          <div className={`p-8 rounded-3xl bg-gradient-to-br ${feature.color} shadow-2xl relative`}>
                            <div className="text-white">
                              {feature.icon}
                            </div>
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} rounded-3xl blur-xl opacity-50 -z-10`}></div>
                          </div>
                        </motion.div>
  
                        {/* Content Section */}
                        <div className="flex-1 text-center lg:text-left">
                          <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                          >
                            <h3 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                              {feature.title}
                            </h3>
                            <div className={`h-1 w-24 bg-gradient-to-r ${feature.color} rounded-full mb-8 ${window.innerWidth < 1024 ? 'mx-auto' : ''}`}></div>
                            <p className="text-xl text-gray-300 leading-relaxed max-w-2xl">
                              {feature.description}
                            </p>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </motion.div>
            </div>
  
            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-12">
              {/* Previous Button */}
              <motion.button
                onClick={prevFeature}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <FaChevronLeft className="w-6 h-6" />
              </motion.button>
  
              {/* Dots Indicator */}
              <div className="flex gap-3">
                {features.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-300 rounded-full ${
                      index === currentIndex
                        ? `w-12 h-3 bg-gradient-to-r ${features[currentIndex].color}`
                        : 'w-3 h-3 bg-white/30 hover:bg-white/50'
                    }`}
                    whileHover={{ scale: 1.2 }}
                  />
                ))}
              </div>
  
              {/* Next Button */}
              <motion.button
                onClick={nextFeature}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
              >
                <FaChevronRight className="w-6 h-6" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    );
  }

// Query Animation Section
// Query Animation Section
// Enhanced Query Section with Demo and Visualizations
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




function CTASection() {
    const navigate = useNavigate();
    const handleGetStarted = () => {
  
      navigate('/login');
      console.log('Navigate to login');
    };
  
    return (
        <div className="bg-black relative overflow-hidden py-20">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
  
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10 mb-8">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-400 font-medium">Get Started Today</span>
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Ready to Transform
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                Your Data?
              </span>
            </h2>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
              Join thousands of users who are already revolutionizing their data analysis with voice-driven insights
            </p>
            
            <motion.button
              onClick={handleGetStarted}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl font-bold rounded-full hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-2xl relative overflow-hidden"
            >
              <span className="relative z-10">Get Started For Free</span>
              {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 blur-xl opacity-50 -z-10"></div> */}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }


// Footer Component
function Footer() {

  return (
    <footer className="py-8 bg-black border-t border-gray-800">
      <div className="container mx-auto px-4 text-center">
        <div className="text-2xl font-bold text-transparent bg-clip-text  mb-4">
        <span className="text-white">Vox</span>
        <span className="bg-gradient-to-br from-violet-500 to-pink-500 text-transparent bg-clip-text">Biz</span>
        </div>
        <p className="text-gray-400">
          © 2025 VoxBiz. Transforming Speech into Visual Intelligence.
        </p>
      </div>
    </footer>
  );

}

// Main Hero Page Component
// To this:
export default function VoxBizHeroPage() {
    
    return (
      <div className="bg-black text-white overflow-hidden w-screen">
  
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <QuerySection />
      <CTASection />
      <Footer />
    </div>
  );
}
