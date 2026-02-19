import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope } from 'react-icons/fa';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${API_URL}/auth/forgotpassword`, { email });
      setSubmitted(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 pt-20 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>

        {!submitted ? (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<FaEnvelope className="text-gray-400" />}
                placeholder="Enter your email"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                We'll send you a link to reset your password.
              </p>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
            >
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <div className="p-4 mb-4 border border-green-200 rounded-lg bg-green-50">
              <p className="text-green-800">
                Check your email for a link to reset your password.
              </p>
            </div>
            <Link to="/login" className="inline-block btn-primary">
              Return to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;