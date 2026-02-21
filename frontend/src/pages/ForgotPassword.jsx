import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaArrowLeft, FaLink } from 'react-icons/fa';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const [resetUrl, setResetUrl] = useState('');
  const [resetToken, setResetToken] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      console.log('Sending forgot password request for:', email);
      
      const response = await axios.post(`${API_URL}/auth/forgotpassword`, { 
        email: email.trim() 
      });
      
      console.log('Forgot password response:', response.data);
      
      // Check if we're in development mode with reset link
      if (response.data.devMode && response.data.resetUrl) {
        setDevMode(true);
        setResetUrl(response.data.resetUrl);
        setResetToken(response.data.resetToken);
        setSubmitted(true);
        toast.success('Development mode: Reset link generated!');
      } else {
        // Production mode - just show success message
        setSubmitted(true);
        toast.success('If an account exists with this email, you will receive a reset link.');
      }
      
    } catch (error) {
      console.error('Forgot password error:', error);
      
      // Still show success message for security
      setSubmitted(true);
      toast.success('If an account exists with this email, you will receive a reset link.');
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 pt-20 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <Link to="/login" className="flex items-center mb-4 text-gray-600 hover:text-gray-900">
            <FaArrowLeft className="mr-2" size={14} />
            Back to Login
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {!submitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-md shadow-sm">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full px-3 py-2 pl-10 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white border border-transparent rounded-lg group bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center">
            <div className={`${devMode ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'} border rounded-lg p-6 mb-4`}>
              <div className={`mx-auto flex items-center justify-center h-12 w-12 rounded-full ${devMode ? 'bg-blue-100' : 'bg-green-100'} mb-4`}>
                {devMode ? (
                  <FaLink className="w-6 h-6 text-blue-600" />
                ) : (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                )}
              </div>
              
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                {devMode ? 'Development Mode - Reset Link Generated' : 'Check your email'}
              </h3>
              
              <p className="mb-4 text-sm text-gray-600">
                {devMode ? (
                  <>Click the link below to reset your password:</>
                ) : (
                  <>If an account exists for <span className="font-semibold">{email}</span>, you will receive a password reset link.</>
                )}
              </p>

              {devMode && resetUrl && (
                <div className="mb-4">
                  <a
                    href={resetUrl}
                    className="inline-block px-6 py-3 font-medium text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
                  >
                    Click Here to Reset Password
                  </a>
                  <p className="p-2 mt-3 text-xs text-gray-500 break-all bg-gray-100 rounded">
                    <span className="font-semibold">URL:</span> {resetUrl}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    <span className="font-semibold">Token:</span> {resetToken}
                  </p>
                </div>
              )}

              <p className="text-xs text-gray-500">
                {devMode ? (
                  <>This link will expire in 10 minutes.</>
                ) : (
                  <>
                    Didn't receive the email? Check your spam folder or{' '}
                    <button
                      onClick={() => setSubmitted(false)}
                      className="font-medium text-primary-600 hover:text-primary-700"
                    >
                      try again
                    </button>
                  </>
                )}
              </p>
            </div>
            
            <Link
              to="/login"
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700"
            >
              <FaArrowLeft className="mr-2" size={12} />
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;