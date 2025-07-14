import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiPhone } from 'react-icons/fi';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    number: '',
    gender: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { username, password, name, number, gender } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const makeRequest = async (endpoint, body) => {
    const token = sessionStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'x-auth-token': token })
    };

    try {
      const response = await fetch(`http://localhost:5000/api/auth${endpoint}`, {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.msg || 'An error occurred');
      }

      return data;
    } catch (err) {
      throw new Error(err.message || 'An error occurred');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const endpoint = isLogin ? '/login' : '/signup';
      const body = isLogin 
        ? { username, password }
        : { username, name, number, gender, password };

      const data = await makeRequest(endpoint, body);

      if (data.token) {
        sessionStorage.setItem('token', data.token);
        setSuccess(isLogin ? 'Login successful!' : 'Account created successfully!');
        navigate('/chat');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans bg-gradient-to-br from-[#0F172A] to-[#1E3A8A] min-h-screen flex flex-col">
        <header className="bg-[#1E3A8A] p-6 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-[#E5E7EB]">FuturChat</h1>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
          <div className="w-full max-w-md">
            <div className="bg-[#1E3A8A] p-8 rounded-2xl shadow-2xl w-full max-w-md text-[#E5E7EB] backdrop-blur-lg bg-opacity-50 border-2 border-[#2563EB]">
              <h2 className="text-2xl font-bold mb-6 text-center text-[#FACC15]">Welcome to FuturChat</h2>
              
              <div className="flex mb-8 bg-[#312E81] rounded-lg overflow-hidden">
                <button
                  type="button"
                  className={`flex-1 py-3 text-center transition-all duration-300 ${
                    isLogin ? 'bg-[#2563EB] text-[#E5E7EB] shadow-lg' : 'text-[#A78BFA] hover:bg-[#312E81] hover:text-[#E5E7EB]'
                  }`}
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setSuccess('');
                  }}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`flex-1 py-3 text-center transition-all duration-300 ${
                    !isLogin ? 'bg-[#2563EB] text-[#E5E7EB] shadow-lg' : 'text-[#A78BFA] hover:bg-[#312E81] hover:text-[#E5E7EB]'
                  }`}
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setSuccess('');
                  }}
                >
                  Sign Up
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg text-red-100 text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg text-green-100 text-sm">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A78BFA]" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    className="w-full py-3 pl-10 pr-3 bg-[#312E81] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#E5E7EB] placeholder-[#A78BFA]"
                    value={username}
                    onChange={handleChange}
                    required
                    minLength={3}
                  />
                </div>

                {!isLogin && (
                  <>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A78BFA]" />
                      <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        className="w-full py-3 pl-10 pr-3 bg-[#312E81] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#E5E7EB] placeholder-[#A78BFA]"
                        value={name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A78BFA]" />
                      <input
                        type="tel"
                        name="number"
                        placeholder="Phone Number"
                        className="w-full py-3 pl-10 pr-3 bg-[#312E81] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#E5E7EB] placeholder-[#A78BFA]"
                        value={number}
                        onChange={handleChange}
                        required
                        pattern="[0-9]{10}"
                        title="Please enter a valid 10-digit phone number"
                      />
                    </div>

                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A78BFA]" />
                      <select
                        name="gender"
                        className="w-full py-3 pl-10 pr-3 bg-[#312E81] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#E5E7EB] placeholder-[#A78BFA]"
                        value={gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A78BFA]" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full py-3 pl-10 pr-3 bg-[#312E81] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563EB] text-[#E5E7EB] placeholder-[#A78BFA]"
                    value={password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-[#2563EB] hover:bg-[#1E40AF] text-[#E5E7EB] font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FACC15] transition-colors duration-300 shadow-lg ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Sign Up')}
                </button>
              </form>

              {isLogin && (
                <p className="mt-6 text-center text-[#A78BFA] text-sm">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    className="text-[#FACC15] hover:text-[#FDE68A] font-semibold transition-colors duration-300"
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Sign Up
                  </button>
                </p>
              )}
            </div>
          </div>
        </main>
      </div>
  );
};

export default AuthForm;
