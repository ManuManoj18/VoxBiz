// Footer Component
import React from 'react';
import { motion } from 'framer-motion';

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
  <div className="text-2xl font-bold flex items-center whitespace-nowrap cursor-pointer hover:scale-105 transition-transform duration-200"   style={{ fontSize: '1.8rem', lineHeight: '1.5rem' }}>
  Vox<span className="bg-gradient-to-br from-violet-500 to-pink-500 text-transparent bg-clip-text">Biz</span>
  </div>
}
export default Footer;