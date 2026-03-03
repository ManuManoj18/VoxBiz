// Demo Section Component
function DemoSection() {
    const [showVideo, setShowVideo] = useState(false);
    const videoRef = useRef(null);
  
    const handleDemoStart = () => {
      setShowVideo(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play();
        }
      }, 100);
    };
  
    const languages = ["Welcome", "नमस्ते", "ಸ್ವಾಗತ", "স্বাগতম", "வணக்கம்", "స్వాగతం"];
  
    return (
      <div id="demo-section" className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              See It In{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Action
              </span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience the power of voice-driven data visualization with our interactive demo
            </p>
          </motion.div>
  
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden"
          >
            <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 flex items-center justify-center">
              {!showVideo ? (
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-6">
                    Interactive Speech Demo
                  </h3>
                  <p className="text-gray-300 mb-8">
                    Click any language below to start the demonstration
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {languages.map((word, index) => (
                      <motion.button
                        key={index}
                        onClick={handleDemoStart}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-800/50 hover:bg-gray-700/70 backdrop-blur-sm rounded-xl p-4 text-white font-semibold transition-all duration-300 border border-gray-600 hover:border-blue-400"
                      >
                        {word}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <video
                    ref={videoRef}
                    src="/demo.mp4"
                    className="w-full h-full object-contain rounded-lg"
                    controls
                    poster="/demo-poster.jpg"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }