import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMicrophone, FaChartBar, FaLanguage, FaRobot, FaDatabase, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ThreeDMarquee from './ui/3DMarquee';
import { FaPlay } from 'react-icons/fa';

function HeroSection() {
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

  const handleGetStarted = () => {
    navigate('/login');
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

export default HeroSection;