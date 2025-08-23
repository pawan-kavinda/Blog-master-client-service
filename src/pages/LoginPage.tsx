import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);
    if (!result.success) setError(result.message || 'Login failed');

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600 text-sm md:text-base">Sign in to your account to continue</p>
        </div>

        {/* Demo Account Info */}
        {/* <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-6 shadow-sm">
          <h3 className="text-sm font-medium text-indigo-800 mb-2">Demo Account</h3>
          <p className="text-sm text-indigo-700 mb-2">Use these credentials to test the platform:</p>
          <div className="text-sm text-indigo-600 space-y-1">
            <p><strong>Email:</strong> demo@example.com</p>
            <p><strong>Password:</strong> password</p>
          </div>
        </div> */}

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 font-medium text-sm">
                {error}
              </div>
            )}

            {[
              { id: 'email', label: 'Email address', type: 'email', icon: <Mail className="h-5 w-5 text-gray-400" /> },
              { id: 'password', label: 'Password', type: 'password', icon: <Lock className="h-5 w-5 text-gray-400" />, show: showPassword, toggle: () => setShowPassword(!showPassword) },
            ].map((field) => (
              <div key={field.id} className="relative">
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">{field.icon}</div>
                  <input
                    type={field.type === 'password' ? (field.show ? 'text' : 'password') : field.type}
                    id={field.id}
                    name={field.id}
                    value={formData[field.id as keyof typeof formData]}
                    onChange={handleInputChange}
                    placeholder={field.label}
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition-all hover:shadow-md"
                  />
                  {field.type === 'password' && (
                    <button
                      type="button"
                      onClick={field.toggle}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {field.show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-600 focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-indigo-500 hover:text-indigo-400 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
