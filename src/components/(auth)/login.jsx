'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { signIn } from "next-auth/react";
const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const result= await signIn("credentials",{
        email:formData.email,
        password:formData.password,
        redirect:false,
      });
      console.log('SignIn result:', result);
           if (result?.ok) {
      window.location.replace("/dashboard"); // replace instead of href
    } else {
      setErrors((prev) => ({
        ...prev,
        submit: "Invalid email or password",
      }));
    }
      console.log('Form submitted:', formData);
    } catch (error) {
      console.error('Login error:', error);
      setErrors((prev) => ({
        ...prev,
        submit: 'Login failed. Please try again.',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-dark-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-blue-950/10 pointer-events-none"></div>
      
      <div className="w-full max-w-md bg-dark-bg-secondary/95 rounded-2xl shadow-dark-xl p-8 border border-dark-border relative z-10 backdrop-blur-xs">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent mb-2">Welcome Back</h1>
          <p className="text-dark-text-secondary">Sign in to your Homemakers account</p>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-900/60 rounded-lg text-red-300 text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-2 border rounded-lg bg-dark-bg-primary text-dark-text placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:bg-dark-bg-tertiary transition ${
                errors.email ? 'border-red-900/60' : 'border-dark-border'
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                className={`w-full px-4 py-2 border rounded-lg bg-dark-bg-primary text-dark-text placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:bg-dark-bg-tertiary transition pr-10 ${
                  errors.password ? 'border-red-900/60' : 'border-dark-border'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted hover:text-dark-text-secondary transition"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <a href="#" className="text-sm text-accent-light hover:text-accent-primary transition font-medium">
              Forgot password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-primary hover:bg-accent-dark disabled:bg-dark-bg-tertiary text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-dark-lg"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-dark-border text-center">
          <p className="text-dark-text-secondary text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-accent-light hover:text-accent-primary font-medium transition">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
