import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../lib/api';

// Toast Component
const Toast = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'error' ? 'bg-red-500' : type === 'success' ? 'bg-green-500' : 'bg-blue-500';
  const icon = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="font-medium">{message}</span>
        <button 
          onClick={onClose}
          className="ml-2 text-white/80 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const Signup = () => {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  
  // Validation states
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  // Toast state
  const [toast, setToast] = useState({
    message: '',
    type: 'info',
    isVisible: false
  });

  // Messages state for compatibility with your handleSubmit
  const [messages, setMessages] = useState([]);

  const showToast = (message, type = 'info') => {
    setToast({
      message,
      type,
      isVisible: true
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  // Mock navigate function for demo (replace with your actual navigation)
  const navigateTo = (path) => {
    navigate(path);
  };
  
  const [translations, setTranslations] = useState({
    googleSignUp: 'Sign up with Google',
    or: 'or',
    username: 'Username',
    email: 'Email',
    password: 'Password',
    createAccount: 'Create your account',
    alreadyHaveAccount: 'Already have an account?',
    signinHere: 'Sign in Here',
    oneClick: 'One click to start',
    allDigital: 'your journey.',
    creatingAccount: 'Creating account...'
  });

  // Validation functions
  const validateUsername = (username) => {
    if (!username) return 'Username is required';
    if (username.length < 3) return 'Username must be at least 3 characters long';
    if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores';
    return '';
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return 'Email is required';
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return '';
  };

  const validatePassword = (password) => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    newErrors.username = validateUsername(formData.username);
    newErrors.email = validateEmail(formData.email);
    newErrors.password = validatePassword(formData.password);
    
    setErrors(newErrors);
    return !newErrors.username && !newErrors.email && !newErrors.password;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ 
      ...prevState,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validate on blur
    if (name === 'username') {
      const error = validateUsername(value);
      setErrors(prev => ({ ...prev, username: error }));
    } else if (name === 'email') {
      const error = validateEmail(value);
      setErrors(prev => ({ ...prev, email: error }));
    } else if (name === 'password') {
      const error = validatePassword(value);
      setErrors(prev => ({ ...prev, password: error }));
    }
  };

  const handleGoogleSignUp = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock response for demo
      const mockSuccess = Math.random() > 0.3; // 70% success rate for demo
      
      if (mockSuccess) {
        showToast('Google Sign-up successful!', 'success');
        setTimeout(() => navigate('/main'), 1000);
      } else {
        throw new Error('Google authentication failed');
      }
    } catch (err) {
      console.error("Google Sign-up Error:", err);
      showToast(err.message || "Google Sign-up failed", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showToast('Please fix the errors before submitting', 'error');
      return;
    }

    setIsLoading(true);
    
    try {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Registration successful:', data);
        setMessages(prev => [...prev, { 
          text: "Your account has been created successfully!", 
          type: 'assistant' 
        }]);
        showToast('Account created successfully!', 'success');
        setFormData({ username: "", email: "", password: "" });
        setTimeout(() => navigateTo('/main'), 1000);
      } else {
        console.error('Registration failed:', response.statusText);
        setMessages(prev => [...prev, { 
          text: "There was an issue creating your account. Please try again.", 
          type: 'assistant' 
        }]);
        showToast('Registration failed. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      setMessages(prev => [...prev, { 
        text: "An error occurred while creating your account. Please try again later.", 
        type: 'assistant' 
      }]);
      showToast('An error occurred. Please try again later.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black w-screen h-screen flex items-center justify-center transition-colors duration-300">
      {/* Toast Component */}
      <Toast 
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
      
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg mx-auto px-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>

        {/* Welcome Badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 bg-white/5 border-white/10 backdrop-blur-sm px-4 py-2 rounded-full border">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-cyan-400 font-medium text-sm">
              {"Get Started".split("").map((char, index) => (
                <span
                  key={index}
                  className="inline-block animate-bounce"
                  style={{
                    animationDelay: `${index * 0.1}s`,
                    animationDuration: '0.6s',
                    animationIterationCount: 'infinite'
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </div>
        </div>
        
        {/* Title */}
        <div className="text-center text-white mb-8">
          <h1 className="text-2xl md:text-3xl font-bold flex flex-wrap justify-center items-center gap-2">
            <span>
              {translations.oneClick.split("").map((char, index) => (
                <span
                  key={index}
                  className="inline-block animate-pulse"
                  style={{
                    animationDelay: `${index * 0.15}s`,
                    animationDuration: '1s',
                    animationIterationCount: 'infinite'
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              {translations.allDigital.split("").map((char, index) => (
                <span
                  key={index}
                  className="inline-block animate-bounce"
                  style={{
                    animationDelay: `${(index + translations.oneClick.length) * 0.12}s`,
                    animationDuration: '0.8s',
                    animationIterationCount: 'infinite'
                  }}
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </span>
          </h1>
        </div>

        {/* Signup Form */}
        <div className="bg-white/5 border-white/10 backdrop-blur-xl p-6 rounded-2xl border shadow-xl">
          <h2 className="text-xl font-bold text-white text-center mb-6">{translations.createAccount}</h2>
          
          <button
            onClick={handleGoogleSignUp}
            disabled={isLoading}
            className="flex items-center justify-center w-full bg-white/10 hover:bg-white/20 border-white/10 text-white backdrop-blur-sm border rounded-xl py-2.5 px-4 mb-4 transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                Loading...
              </div>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    fill="#4285F4"
                  />
                </svg>
                {translations.googleSignUp}
              </>
            )}
          </button>
          
          <div className="flex items-center justify-center my-4">
            <div className="border-t border-white/10 flex-grow"></div>
            <span className="px-3 text-gray-400 text-sm">{translations.or}</span>
            <div className="border-t border-white/10 flex-grow"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {translations.username}<span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="username"
                className={`w-full p-2.5 bg-white/10 ${errors.username ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-white/20 focus:border-cyan-400 focus:ring-cyan-400'} text-white backdrop-blur-sm border rounded-lg placeholder-gray-400 focus:ring-1 transition-all duration-300`}
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.username}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {translations.email}<span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                name="email"
                className={`w-full p-2.5 bg-white/10 ${errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-white/20 focus:border-cyan-400 focus:ring-cyan-400'} text-white backdrop-blur-sm border rounded-lg placeholder-gray-400 focus:ring-1 transition-all duration-300`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.email}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {translations.password}<span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                name="password"
                className={`w-full p-2.5 bg-white/10 ${errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-400' : 'border-white/20 focus:border-cyan-400 focus:ring-cyan-400'} text-white backdrop-blur-sm border rounded-lg placeholder-gray-400 focus:ring-1 transition-all duration-300`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-400 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.password}
                </p>
              )}
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2.5 rounded-lg font-medium hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  {translations.creatingAccount}
                </div>
              ) : (
                translations.createAccount
              )}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-gray-400 text-sm">
              {translations.alreadyHaveAccount}{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {translations.signinHere}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;