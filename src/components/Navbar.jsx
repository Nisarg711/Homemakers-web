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
    <nav className="bg-dark-bg-secondary/95 border-b border-dark-border shadow-dark-lg sticky top-0 z-50 backdrop-blur-xs">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left Section - Logo and Location */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">HomeMakers</span>
          </div>

          {/* Location Selector */}
          <div className="relative">
            <button
              onMouseEnter={() => setShowCityDropdown(true)}
              onMouseLeave={() => setShowCityDropdown(false)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-dark-bg-hover transition text-dark-text-secondary font-medium"
            >
              
              <span>{selectedCity}</span>
            </button>

            {showCityDropdown && (
              <div
                onMouseEnter={() => setShowCityDropdown(true)}
                onMouseLeave={() => setShowCityDropdown(false)}
                className="absolute top-full mt-2 w-72 bg-dark-bg-tertiary rounded-lg shadow-dark-xl border border-dark-border p-4 left-0 z-50"
              >
                {/* Search Bar */}
                <div className="mb-4 relative">
                  <Search size={18} className="absolute left-3 top-2.5 text-dark-text-muted" />
                  <input
                    type="text"
                    placeholder="Search cities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-dark-border rounded-lg bg-dark-bg-secondary text-dark-text focus:outline-none focus:ring-2 focus:ring-accent-primary placeholder:text-dark-text-muted text-sm"
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
                            ? 'bg-accent-primary text-white font-semibold'
                            : 'text-dark-text-secondary hover:bg-dark-bg-hover'
                        }`}
                      >
                        {city}
                      </button>
                    ))
                  ) : (
                    <p className="text-dark-text-muted text-sm text-center py-4">No cities found</p>
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
              className="text-dark-text-secondary font-medium hover:text-accent-primary transition"
            >
              Buy
            </a>
            <a
              href="#"
              className="text-dark-text-secondary font-medium hover:text-accent-primary transition"
            >
              Sell
            </a>
            <a
              href="#"
              className="text-dark-text-secondary font-medium hover:text-accent-primary transition"
            >
              About us
            </a>
          </div>

          {/* Profile Icon */}
          <button
            onClick={handleProfileClick}
            className="p-2 rounded-full hover:bg-dark-bg-hover transition"
          >
            <User size={24} className="text-dark-text-secondary" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
