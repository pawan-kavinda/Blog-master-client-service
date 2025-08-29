import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, User, UserPlus } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const validateForm = () => {
    const errors: string[] = [];
    if (formData.username.length < 3) errors.push('Username must be at least 3 characters');
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.push('Please enter a valid email');
    if (formData.password.length < 6) errors.push('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) errors.push('Passwords do not match');
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    const result = await register(formData.username, formData.email, formData.password);
    if (!result.success) setError(result.message || 'Registration failed');
    setLoading(false);
  };

  const fields = [
    { id: 'username', label: 'Username', type: 'text', icon: <User className="h-5 w-5 text-gray-400" /> },
    { id: 'email', label: 'Email address', type: 'email', icon: <Mail className="h-5 w-5 text-gray-400" /> },
    { id: 'password', label: 'Password', type: 'password', icon: <Lock className="h-5 w-5 text-gray-400" />, show: showPassword, toggle: () => setShowPassword(!showPassword) },
    { id: 'confirmPassword', label: 'Confirm Password', type: 'password', icon: <Lock className="h-5 w-5 text-gray-400" />, show: showConfirmPassword, toggle: () => setShowConfirmPassword(!showConfirmPassword) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        
        <div className="text-center mb-8">
          <div className="bg-gradient-to-tr from-purple-400 to-pink-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Join Vite Blogger</h1>
          <p className="text-gray-600 text-sm md:text-base">Create your account and start sharing your stories</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 font-medium text-sm">
                {error}
              </div>
            )}

            {validationErrors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600 text-sm space-y-1">
                {validationErrors.map((err, idx) => (
                  <p key={idx}>• {err}</p>
                ))}
              </div>
            )}

            {/* Input Fields */}
            {fields.map((field, i) => (
              <div key={i} className="relative">
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
                
                {/* Icon wrapper */}
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
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all hover:shadow-md"
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
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating account...
                </div>
              ) : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-purple-500 hover:text-purple-400 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
