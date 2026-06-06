'use client';

import React, { useState } from 'react';
import { MapPin, Search, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Navbar = ({ onLocationChange }) => {
  const router = useRouter();
  const [selectedCity, setSelectedCity] = useState('All India');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cities = [
    'All India',
    'Mumbai',
    'Delhi',
    'Bangalore',
    'Hyderabad',
    'Chennai',
    'Kolkata',
    'Pune',
    'Ahmedabad',
    'Jaipur',
    'Lucknow',
    'Chandigarh',
    'Indore',
    'Surat',
    'Goa',
  ];

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    if (onLocationChange) {
      onLocationChange(city);
    }
    setShowCityDropdown(false);
    setSearchQuery('');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left Section - Logo and Location */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-xl font-bold text-gray-900">HomeMakers</span>
          </div>

          {/* Location Selector */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowCityDropdown(true)}
              onMouseLeave={() => setShowCityDropdown(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition text-gray-700 font-medium"
            >
              
              <span>{selectedCity}</span>
            </button>

            {showCityDropdown && (
              <div
                onMouseEnter={() => setShowCityDropdown(true)}
                onMouseLeave={() => setShowCityDropdown(false)}
                className="absolute top-full mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 p-4 left-0 z-50"
              >
                {/* Search Bar */}
                <div className="mb-4 relative">
                  <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 text-sm"
                    autoFocus
                  />
                </div>

                {/* Cities List */}
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleCitySelect(city)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition ${
                          selectedCity === city
                            ? 'bg-blue-100 text-blue-700 font-semibold'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {city}
                      </button>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm text-center py-4">No cities found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Section - Navigation and Profile */}
        <div className="flex items-center gap-6">
          {/* Navigation Links */}
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
              Buy
            </a>
            <a
              href="#"
              className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
              Sell
            </a>
            <a
              href="#"
              className="text-gray-700 font-medium hover:text-blue-600 transition"
            >
              About us
            </a>
          </div>

          {/* Profile Icon */}
          <button
            onClick={handleProfileClick}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <User size={24} className="text-gray-700" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
