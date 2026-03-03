import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
    import { FaMicrophone, FaChartBar, FaLanguage, FaRobot, FaDatabase, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';


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
  export default FeaturesSection;