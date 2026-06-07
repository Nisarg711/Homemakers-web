'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, User, Mail, Lock, Building2, MapPin, Phone } from 'lucide-react';
import { signIn } from "next-auth/react";

const SignIn = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contactNo: '',
    password: '',
    confirmPassword: '',
    userType: 'individual',
    officeName: '',
    officeAddress: '',
    officeContact: '',
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.contactNo.trim()) {
      newErrors.contactNo = 'Contact number is required';
    } else if (!/^\d{10}$/.test(formData.contactNo.replace(/\D/g, ''))) {
      newErrors.contactNo = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.userType === 'firm') {
      if (!formData.officeName.trim()) {
        newErrors.officeName = 'Office name is required';
      }
      if (!formData.officeAddress.trim()) {
        newErrors.officeAddress = 'Office address is required';
      }
      if (!formData.officeContact.trim()) {
        newErrors.officeContact = 'Office contact is required';
      } else if (!/^\d{10}$/.test(formData.officeContact.replace(/\D/g, ''))) {
        newErrors.officeContact = 'Please enter a valid 10-digit phone number';
      }
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
      // TODO: Backend API call to register user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data=await response.json();
      console.log('API response:', data);  // now log the parsed data
      if (!response.ok) {
        throw new Error('Registration failed');
      }
      
      const signInResult = await signIn("credentials", {
      email: formData.email,
      password: formData.password, // use original password, not hashed
      //// plain text — authorize() will bcrypt.compare internally
      redirect: false,
    });

      if (signInResult?.error) {
      // Registration worked but sign in failed — send to login
      router.push("/");
    } else {
      // Both worked — go straight to dashboard
      router.push("/dashboard");
    }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors((prev) => ({
        ...prev,
        submit: 'Registration failed. Please try again.',
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent mb-2">Create Account</h1>
          <p className="text-dark-text-secondary">Join Homemakers and start your journey</p>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-900/60 rounded-lg text-red-300 text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Field */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Choose a username"
              className={`w-full px-4 py-2 border rounded-lg bg-dark-bg-primary text-dark-text placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:bg-dark-bg-tertiary transition ${
                errors.username ? 'border-red-900/60' : 'border-dark-border'
              }`}
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
            )}
          </div>

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

          {/* Contact Number Field */}
          <div>
            <label htmlFor="contactNo" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              id="contactNo"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleInputChange}
              placeholder="Enter 10-digit phone number"
              className={`w-full px-4 py-2 border rounded-lg bg-dark-bg-primary text-dark-text placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:bg-dark-bg-tertiary transition ${
                errors.contactNo ? 'border-red-900/60' : 'border-dark-border'
              }`}
            />
            {errors.contactNo && (
              <p className="text-red-400 text-xs mt-1">{errors.contactNo}</p>
            )}
          </div>

          {/* User Type Field */}
          <div>
            <label htmlFor="userType" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Account Type
            </label>
            <select
              id="userType"
              name="userType"
              value={formData.userType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-dark-border rounded-lg bg-dark-bg-primary text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-primary focus:bg-dark-bg-tertiary transition font-medium appearance-none cursor-pointer"
            >
              <option value="individual" className="bg-dark-bg-primary text-dark-text font-semibold">Individual Buyer/Renter</option>
              <option value="firm" className="bg-dark-bg-primary text-dark-text font-semibold">Firm</option>
              <option value="agent" className="bg-dark-bg-primary text-dark-text font-semibold">Real Estate Agent</option>
            </select>
          </div>

          {/* Conditional Firm Fields */}
          {formData.userType === 'firm' && (
            <>
              <div>
                <label htmlFor="officeName" className="block text-sm font-medium text-dark-text-secondary mb-1">
                  Office Name
                </label>
                <input
                  type="text"
                  id="officeName"
                  name="officeName"
                  value={formData.officeName}
                  onChange={handleInputChange}
                  placeholder="Enter office name"
                  className={`w-full px-4 py-2 border rounded-lg bg-dark-bg-primary text-dark-text placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:bg-dark-bg-tertiary transition ${
                    errors.officeName ? 'border-red-900/60' : 'border-dark-border'
                  }`}
                />
                {errors.officeName && (
                  <p className="text-red-400 text-xs mt-1">{errors.officeName}</p>
                )}
              </div>

              <div>
                <label htmlFor="officeAddress" className="block text-sm font-medium text-dark-text-secondary mb-1">
                  Office Address
                </label>
                <textarea
                  id="officeAddress"
                  name="officeAddress"
                  value={formData.officeAddress}
                  onChange={handleInputChange}
                  placeholder="Enter office address"
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-lg bg-dark-bg-primary text-dark-text placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:bg-dark-bg-tertiary transition resize-none ${
                    errors.officeAddress ? 'border-red-900/60' : 'border-dark-border'
                  }`}
                />
                {errors.officeAddress && (
                  <p className="text-red-400 text-xs mt-1">{errors.officeAddress}</p>
                )}
              </div>

              <div>
                <label htmlFor="officeContact" className="block text-sm font-medium text-dark-text-secondary mb-1">
                  Office Contact Number
                </label>
                <input
                  type="tel"
                  id="officeContact"
                  name="officeContact"
                  value={formData.officeContact}
                  onChange={handleInputChange}
                  placeholder="Enter 10-digit phone number"
                  className={`w-full px-4 py-2 border rounded-lg bg-dark-bg-primary text-dark-text placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:bg-dark-bg-tertiary transition ${
                    errors.officeContact ? 'border-red-900/60' : 'border-dark-border'
                  }`}
                />
                {errors.officeContact && (
                  <p className="text-red-400 text-xs mt-1">{errors.officeContact}</p>
                )}
              </div>
            </>
          )}

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
                placeholder="Create a password"
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

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-dark-text-secondary mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Confirm your password"
                className={`w-full px-4 py-2 border rounded-lg bg-dark-bg-primary text-dark-text placeholder:text-dark-text-muted focus:outline-none focus:ring-2 focus:ring-accent-primary focus:bg-dark-bg-tertiary transition pr-10 ${
                  errors.confirmPassword ? 'border-red-900/60' : 'border-dark-border'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dark-text-muted hover:text-dark-text-secondary transition"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent-primary hover:bg-accent-dark disabled:bg-dark-bg-tertiary text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-dark-lg"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-dark-text-secondary text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-light hover:text-accent-primary font-medium transition">
              Log in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
