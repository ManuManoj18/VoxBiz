import React from 'react';
import { motion } from 'framer-motion';


function CTASection() {
    const handleGetStarted = () => {
      // navigate('/login');
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
              <span className="relative z-10">Get Started Free</span>
              {/* <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 blur-xl opacity-50 -z-10"></div> */}
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }
export default CTASection;